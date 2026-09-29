// Point-cloud states for the backdrop. One cloud, seven states, one per
// section; the backdrop morphs point i of state k into point i of state k+1
// as the reader scrolls. Every state is something a developer writes or draws.

export const STATE_HERO = 0; // </>
export const STATE_ABOUT = 1; // { }
export const STATE_SERVICES = 2; // four stacked layers
export const STATE_WORK = 3; // a sphere, spun by the project rail
export const STATE_PROCESS = 4; // a four-stage pipeline
export const STATE_EXPERIENCE = 5; // a git graph: main plus one merged branch
export const STATE_CONTACT = 6; // @
export const STATE_COUNT = 7;

export const PLANE_Y = [1.1, 0.37, -0.37, -1.1];
export const PLANE_HALF = 1.05;

export type Vec3 = [number, number, number];

export type Geometry = {
  n: number;
  states: Float32Array[];
  baseHighlight: Float32Array[];
  jitter: Float32Array;
  layerOf: Int8Array;
  nodeOf: Int8Array;
  edgeOf: Int8Array;
  edgeT: Float32Array;
  // the four pipeline stages
  nodes: Vec3[];
  // git graph: commit positions, and which one is HEAD
  commits: Vec3[];
  head: number;
  // About: x of the braces' inner edges (units from centre), so the backdrop
  // can size them to wrap the real video window.
  braceInner: number;
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number) {
  const u = Math.max(1e-6, rand());
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

type Glyph = { x: Float32Array; y: Float32Array; edge: Uint8Array; count: number };

// Rasterise text once, keep its filled pixels, and mark the ones on an edge.
// Sampling mostly edges keeps the symbol crisp; the rest gives it body.
function rasterGlyph(text: string, font: string): Glyph {
  const Wc = 900;
  const Hc = 520;
  const c = document.createElement("canvas");
  c.width = Wc;
  c.height = Hc;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font;
  ctx.fillText(text, Wc / 2, Hc / 2);
  const data = ctx.getImageData(0, 0, Wc, Hc).data;
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < Wc && y < Hc && data[(y * Wc + x) * 4 + 3] > 128;
  const xs: number[] = [];
  const ys: number[] = [];
  const es: number[] = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  const step = 2;
  for (let y = 0; y < Hc; y += step) {
    for (let x = 0; x < Wc; x += step) {
      if (!on(x, y)) continue;
      const edge = !on(x - 4, y) || !on(x + 4, y) || !on(x, y - 4) || !on(x, y + 4);
      xs.push(x);
      ys.push(y);
      es.push(edge ? 1 : 0);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  // Normalise so the glyph's box is centred on 0 and its height is 1.
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const h = Math.max(1, maxY - minY);
  const count = xs.length;
  const gx = new Float32Array(count);
  const gy = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    gx[i] = (xs[i] - cx) / h;
    gy[i] = -(ys[i] - cy) / h;
  }
  return { x: gx, y: gy, edge: Uint8Array.from(es), count };
}

function sampleGlyph(g: Glyph, rand: () => number, edgeShare: number): [number, number] {
  if (!g.count) return [0, 0];
  // Rejection sample toward edge pixels.
  for (let tries = 0; tries < 12; tries++) {
    const k = Math.floor(rand() * g.count);
    const wantEdge = rand() < edgeShare;
    if (g.edge[k] === (wantEdge ? 1 : 0) || tries === 11) return [g.x[k], g.y[k]];
  }
  return [0, 0];
}

// Points on the surface of a small cube, so pipeline stages read as built blocks.
function cubePoint(rand: () => number, s: number): Vec3 {
  const face = Math.floor(rand() * 6);
  const a = (rand() * 2 - 1) * s;
  const b = (rand() * 2 - 1) * s;
  const sign = face % 2 ? 1 : -1;
  if (face < 2) return [sign * s, a, b];
  if (face < 4) return [a, sign * s, b];
  return [a, b, sign * s];
}

export function buildGeometry(n: number, monoFamily: string): Geometry {
  const rand = mulberry32(20260929);
  const states = Array.from({ length: STATE_COUNT }, () => new Float32Array(n * 3));
  const baseHighlight = Array.from({ length: STATE_COUNT }, () => new Float32Array(n));
  const jitter = new Float32Array(n * 3);
  const layerOf = new Int8Array(n).fill(-1);
  const nodeOf = new Int8Array(n).fill(-1);
  const edgeOf = new Int8Array(n).fill(-1);
  const edgeT = new Float32Array(n);

  const set = (s: number, i: number, p: Vec3) => {
    states[s][i * 3] = p[0];
    states[s][i * 3 + 1] = p[1];
    states[s][i * 3 + 2] = p[2];
  };

  for (let i = 0; i < n; i++) {
    const len = 0.3 + rand() * 0.7;
    const a = rand() * Math.PI * 2;
    const b = Math.acos(2 * rand() - 1);
    jitter[i * 3] = Math.sin(b) * Math.cos(a) * len;
    jitter[i * 3 + 1] = Math.cos(b) * len;
    jitter[i * 3 + 2] = Math.sin(b) * Math.sin(a) * len;
  }

  const font = `700 360px ${monoFamily}`;
  const depth = 0.2; // extrusion of the glyph states, so they have a front and a back

  // 0. Hero: </> with the slash in the accent colour.
  {
    const lt = rasterGlyph("<", font);
    const sl = rasterGlyph("/", font);
    const gt = rasterGlyph(">", font);
    const H = 2.2;
    const parts = [
      { g: lt, dx: -1.35, share: 0.36, hl: 0 },
      { g: sl, dx: 0, share: 0.28, hl: 1 },
      { g: gt, dx: 1.35, share: 0.36, hl: 0 },
    ];
    let i = 0;
    parts.forEach((p, idx) => {
      const count = idx === parts.length - 1 ? n - i : Math.floor(n * p.share);
      for (let k = 0; k < count; k++, i++) {
        const [x, y] = sampleGlyph(p.g, rand, 0.72);
        set(STATE_HERO, i, [p.dx + x * H, y * H, (rand() * 2 - 1) * depth]);
        baseHighlight[STATE_HERO][i] = p.hl;
      }
    });
  }

  // 1. About: { } opened wide, so the video window sits between the braces.
  let braceInner = 1;
  {
    const ob = rasterGlyph("{", font);
    const cb = rasterGlyph("}", font);
    // Slimmer and taller than the raw glyph, so they frame a tall video.
    const HX = 1.9;
    const HY = 3.6;
    for (let i = 0; i < n; i++) {
      const left = i < n / 2;
      const [x, y] = sampleGlyph(left ? ob : cb, rand, 0.72);
      set(STATE_ABOUT, i, [(left ? -1.75 : 1.75) + x * HX, y * HY, (rand() * 2 - 1) * depth]);
    }
    let minX = Infinity;
    for (let k = 0; k < cb.count; k++) minX = Math.min(minX, cb.x[k]);
    braceInner = 1.75 + minX * HX;
  }

  // 2. Services: four stacked planes (one per service) plus corner struts.
  {
    const g = Math.floor(Math.sqrt((n * 0.92) / 4));
    let i = 0;
    for (let p = 0; p < 4; p++) {
      for (let gx = 0; gx < g; gx++) {
        for (let gz = 0; gz < g; gz++) {
          const x = -PLANE_HALF + (2 * PLANE_HALF * gx) / (g - 1);
          const z = -PLANE_HALF + (2 * PLANE_HALF * gz) / (g - 1);
          set(STATE_SERVICES, i, [x, PLANE_Y[p], z]);
          layerOf[i] = p;
          i++;
        }
      }
    }
    const struts: Vec3[] = [
      [PLANE_HALF, 0, PLANE_HALF],
      [-PLANE_HALF, 0, PLANE_HALF],
      [PLANE_HALF, 0, -PLANE_HALF],
      [-PLANE_HALF, 0, -PLANE_HALF],
    ];
    const strutStart = i;
    for (; i < n; i++) {
      const s = struts[(i - strutStart) % 4];
      const y = PLANE_Y[3] + rand() * (PLANE_Y[0] - PLANE_Y[3]);
      set(STATE_SERVICES, i, [s[0], y, s[2]]);
    }
  }

  // 3. Work: a Fibonacci sphere, a finished form the project rail spins.
  {
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let k = 0; k < n; k++) {
      const y = 1 - (2 * (k + 0.5)) / n;
      const r = Math.sqrt(1 - y * y);
      const phi = k * golden;
      set(STATE_WORK, k, [Math.cos(phi) * r * 1.45, y * 1.45, Math.sin(phi) * r * 1.45]);
    }
  }

  // 4. Process: four stages as blocks on a gentle arc, wires between them.
  const nodes: Vec3[] = [0, 1, 2, 3].map((k) => {
    const x = -1.8 + k * 1.2;
    return [x, 0.55 - Math.abs(x) * 0.3, (k % 2 ? -0.35 : 0.35) * 0.6];
  });
  {
    const blockCount = Math.floor(n * 0.13);
    const blocksEnd = blockCount * 4;
    for (let k = 0; k < n; k++) {
      if (k < blocksEnd) {
        const node = Math.floor(k / blockCount);
        const c = nodes[node];
        const p = cubePoint(rand, 0.2);
        set(STATE_PROCESS, k, [c[0] + p[0], c[1] + p[1], c[2] + p[2]]);
        nodeOf[k] = node;
      } else {
        const edge = (k - blocksEnd) % 3;
        const t = 0.12 + rand() * 0.76;
        const a = nodes[edge];
        const b = nodes[edge + 1];
        set(STATE_PROCESS, k, [
          a[0] + (b[0] - a[0]) * t + gaussian(rand) * 0.008,
          a[1] + (b[1] - a[1]) * t + gaussian(rand) * 0.008,
          a[2] + (b[2] - a[2]) * t + gaussian(rand) * 0.008,
        ]);
        edgeOf[k] = edge;
        edgeT[k] = t;
      }
    }
  }

  // 5. Experience: a git graph. `main` runs bottom to top; a branch leaves,
  // carries three commits, and merges back. HEAD is the top commit.
  const branchX = 0.95;
  const branchAt = (y: number) => {
    // smooth out-and-back curve between y=-1.25 and y=1.0
    const t = (y + 1.25) / 2.25;
    const s = Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    return branchX * Math.pow(s, 0.55);
  };
  const commits: Vec3[] = [
    [0, -1.75, 0],
    [0, -1.25, 0],
    [0, -0.35, 0],
    [0, 0.45, 0],
    [0, 1.0, 0],
    [0, 1.75, 0],
    [branchAt(-0.7), -0.7, 0],
    [branchAt(-0.1), -0.1, 0],
    [branchAt(0.5), 0.5, 0],
  ];
  const head = 5;
  {
    const ringCount = Math.floor(n * 0.05);
    const ringsEnd = ringCount * commits.length;
    for (let k = 0; k < n; k++) {
      if (k < ringsEnd) {
        const c = Math.floor(k / ringCount);
        const ang = rand() * Math.PI * 2;
        const r = (c === head ? 0.13 : 0.1) + gaussian(rand) * 0.006;
        set(STATE_EXPERIENCE, k, [commits[c][0] + Math.cos(ang) * r, commits[c][1] + Math.sin(ang) * r, gaussian(rand) * 0.01]);
        baseHighlight[STATE_EXPERIENCE][k] = c === head ? 1 : 0;
      } else if (rand() < 0.55) {
        const y = -1.9 + rand() * 3.65;
        set(STATE_EXPERIENCE, k, [gaussian(rand) * 0.008, y, gaussian(rand) * 0.01]);
      } else {
        const y = -1.25 + rand() * 2.25;
        set(STATE_EXPERIENCE, k, [branchAt(y) + gaussian(rand) * 0.008, y, gaussian(rand) * 0.01]);
      }
    }
  }

  // 6. Contact: @, the way to reach a person.
  {
    const at = rasterGlyph("@", font);
    const H = 2.9;
    for (let k = 0; k < n; k++) {
      const [x, y] = sampleGlyph(at, rand, 0.7);
      set(STATE_CONTACT, k, [x * H, y * H, (rand() * 2 - 1) * depth]);
    }
  }

  return { n, states, baseHighlight, jitter, layerOf, nodeOf, edgeOf, edgeT, nodes, commits, head, braceInner };
}
