"use client";

import { useEffect, useRef } from "react";
import { experience, services } from "@/content/site";
import {
  buildGeometry,
  PLANE_HALF,
  PLANE_Y,
  STATE_ABOUT,
  STATE_EXPERIENCE,
  STATE_HERO,
  STATE_PROCESS,
  STATE_SERVICES,
  STATE_WORK,
  type Geometry,
} from "./geometry";

// The backdrop: one point cloud fixed behind the whole page, drawn in ink on
// paper. The reader's scroll morphs it through one developer symbol per
// section (see BRIEF.md). Bespoke page code; the scroll-craft engine is
// untouched and drives the acts on top of it.

// [centre x, centre y (fractions of the viewport), scale, pitch, alpha, yaw, roll]
type Params = [number, number, number, number, number, number, number?];
const DESKTOP: Params[] = [
  [0.2, -0.12, 0.7, 0.06, 1, 0],
  [-0.235, 0.02, 0.74, 0.04, 0.85, 0],
  [0.25, 0.03, 0.72, 0.5, 1, 0.65],
  [0.0, 0.02, 1.25, 0.25, 0.4, 0],
  [0.22, 0.06, 0.78, 0.35, 1, 0.2],
  [0.26, 0.02, 0.85, 0.05, 0.9, 0],
  [0.25, 0.0, 0.85, 0.08, 0.9, 0],
];
// Phones place each state in its own slot on the page (see measure()), so
// only pitch, alpha, yaw and roll are used here. The git graph lies on its side.
const MOBILE: Params[] = [
  [0, 0, 0, 0.06, 1, 0],
  [0, 0, 0, 0.04, 0.9, 0],
  [0, 0, 0, 0.5, 1, 0.65],
  [0, 0, 0, 0.25, 0.9, 0],
  [0, 0, 0, 0.35, 1, 0.2],
  [0, 0, 0, 0.05, 1, 0, -Math.PI / 2],
  [0, 0, 0, 0.08, 1, 0],
];

type Box = { cx: number; cy: number; w: number; h: number };

// Where the head sits in the portrait cutout (fractions of its box).
const HEAD_Y = 0.26;
const HEAD_HALF = 0.15;
// Pixels the hero </> sits below the head's centre, for room under the top bar.
const HERO_DROP = 54;

const INK = "24,22,17";
const ACCENT = "222,78,26";
const CAMERA = 6.5;
const ALPHA_STEPS = 8;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Backdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const backRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const back = backRef.current;
    if (!root || !back) return;
    const bctx = back.getContext("2d");
    if (!bctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-stage-anchor]"));
    const workEl = document.getElementById("work");
    const processEl = document.getElementById("process");
    const aboutWin = document.querySelector<HTMLElement>(".about__window");
    const heroPortrait = document.querySelector<HTMLElement>(".hero__portrait");
    const workStage = workEl?.querySelector<HTMLElement>(".work__stage") ?? null;
    const slotEls = new Map<number, HTMLElement>();
    document.querySelectorAll<HTMLElement>("[data-backdrop-slot]").forEach((el) => {
      slotEls.set(Number(el.dataset.backdropSlot), el);
    });
    const layerRows = Array.from(document.querySelectorAll<HTMLElement>("[data-layer]"));
    const stepEls = Array.from(document.querySelectorAll<HTMLElement>("[data-step]"));
    const planeLabels = Array.from(root.querySelectorAll<HTMLElement>("[data-plane]"));
    const gitLabels = Array.from(root.querySelectorAll<HTMLElement>("[data-git]"));
    // Widths are read once per resize, never inside the draw loop.
    const labelWidths = new Map<HTMLElement, number>();
    const measureLabels = () => {
      for (const el of [...planeLabels, ...gitLabels]) labelWidths.set(el, el.offsetWidth);
    };

    const monoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";

    let W = 0;
    let H = 0;
    let dpr = 1;
    let mobile = false;
    let geo: Geometry | null = null;
    let needsMeasure = true;
    // The engine moves the rail and the parallax layers in its own frame, so
    // anchors are re-read for a few frames after each scroll to catch the
    // position they actually settle at.
    let settleFrames = 0;
    let needsDraw = true;
    let raf = 0;
    let lastStep = -2;
    // The About braces are placed from the real video window, not a fixed
    // fraction of the screen, so the clip sits between them at any width.
    let aboutAnchor: { cx: number; half: number } | null = null;
    // Likewise the hero </> is placed from the portrait: brackets either side
    // of the head, the slash behind it.
    let heroAnchor: { cx: number; cy: number; headHalf: number } | null = null;
    // Phones: where each state lives on screen right now, and how big each
    // state is, so it can be fitted into its slot.
    let boxes: Box[] = [];
    let extents: { x: number; y: number }[] = [];

    const target = { t: 0, turn: 0, pWork: 0, pProc: 0, px: 0, py: 0, layer: -1 };
    const cur = { t: 0, turn: 0, pWork: 0, pProc: 0, px: 0, py: 0 };
    const layerHL = [0, 0, 0, 0];
    const nodeLit = [0, 0, 0, 0];
    const edgeLit = [0, 0, 0];

    const buckets = [0, 1].map(() => Array.from({ length: ALPHA_STEPS }, () => [] as number[]));

    function rebuild() {
      geo = buildGeometry(mobile ? 1800 : 2600, monoFamily);
      extents = geo.states.map((st, k) => {
        const [, , , pitch, , , roll = 0] = MOBILE[k];
        const cr = Math.cos(roll);
        const sr = Math.sin(roll);
        let ex = 0.01;
        let ey = 0.01;
        for (let i = 0; i < geo!.n; i++) {
          const x = st[i * 3];
          const y = st[i * 3 + 1];
          const z = st[i * 3 + 2];
          const xr = x * cr - y * sr;
          const yr = x * sr + y * cr;
          const rxz = Math.hypot(xr, z);
          ex = Math.max(ex, rxz);
          ey = Math.max(ey, Math.abs(yr) * Math.cos(pitch) + rxz * Math.sin(pitch));
        }
        return { x: ex, y: ey };
      });
      needsDraw = true;
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const m = W < 760;
      if (!geo || m !== mobile) {
        mobile = m;
        rebuild();
      }
      back!.width = Math.round(W * dpr);
      back!.height = Math.round(H * dpr);
      back!.style.width = `${W}px`;
      back!.style.height = `${H}px`;
      measureLabels();
      needsMeasure = true;
      needsDraw = true;
    }

    function actProgress(el: HTMLElement | null) {
      if (!el) return 0;
      const r = el.getBoundingClientRect();
      const travel = r.height - H;
      if (travel <= 1) return clamp01(-r.top / H);
      return clamp01(-r.top / travel);
    }

    const rectBox = (r: DOMRect, cyFrac = 0.5): Box => ({
      cx: r.left + r.width / 2,
      cy: r.top + r.height * cyFrac,
      w: r.width,
      h: r.height,
    });

    // Phones: the shape sits in a slot, and travels between slots as the
    // middle of the screen passes from one to the next.
    function measureSlots() {
      const next: Box[] = [];
      if (heroPortrait) {
        const r = heroPortrait.getBoundingClientRect();
        next[STATE_HERO] = { cx: r.left + r.width / 2, cy: r.top + r.height * HEAD_Y + HERO_DROP * 0.5, w: r.width, h: r.height };
      }
      if (aboutWin) next[STATE_ABOUT] = rectBox(aboutWin.getBoundingClientRect());
      slotEls.forEach((el, k) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) next[k] = rectBox(r);
      });
      const last = MOBILE.length - 1;
      // A state with no slot on the page parks off screen, so it never shows.
      for (let k = 0; k <= last; k++) if (!next[k]) next[k] = { cx: W / 2, cy: -H, w: W * 0.5, h: W * 0.4 };
      boxes = next;

      const yc = H * 0.5;
      let t = 0;
      if (yc >= boxes[last].cy) t = last;
      else
        for (let k = 0; k < last; k++) {
          const a = boxes[k].cy;
          const b = boxes[k + 1].cy;
          if (yc >= a && yc < b) {
            t = k + (yc - a) / Math.max(1, b - a);
            break;
          }
        }
      target.t = t;
      if (workStage) {
        // The sphere turns with the project slider, not the page.
        target.pWork = workStage.scrollLeft / Math.max(1, workStage.scrollWidth - workStage.clientWidth);
      }
    }

    // A hovered service row wins over the one nearest the middle of the screen.
    let hoverLayer = -1;
    const activeLayer = () => (hoverLayer >= 0 ? hoverLayer : target.layer);
    function markLayerRows() {
      const active = activeLayer();
      layerRows.forEach((row, idx) => {
        const on = idx === active ? "true" : "false";
        if (row.dataset.active !== on) row.dataset.active = on;
      });
    }

    function measure() {
      let t = 0;
      let turn = 0;
      anchors.forEach((a, k) => {
        const r = a.getBoundingClientRect();
        if (k > 0) t += clamp01((H - r.top) / (0.7 * H));
        turn += clamp01((H - r.top) / (H + r.height));
      });
      target.t = Math.min(anchors.length - 1, t);
      target.turn = turn;
      target.pWork = actProgress(workEl);
      target.pProc = actProgress(processEl);
      if (mobile) measureSlots();
      if (heroPortrait && !mobile) {
        const r = heroPortrait.getBoundingClientRect();
        heroAnchor =
          r.width > 0
            ? { cx: (r.left + r.width / 2 - W / 2) / W, cy: (r.top + r.height * HEAD_Y + HERO_DROP - H / 2) / H, headHalf: r.width * HEAD_HALF }
            : null;
      }
      if (aboutWin) {
        const r = aboutWin.getBoundingClientRect();
        aboutAnchor = r.width > 0 ? { cx: (r.left + r.width / 2 - W / 2) / W, half: r.width / 2 } : null;
      }

      let best = -1;
      let bestD = Infinity;
      layerRows.forEach((row, idx) => {
        const r = row.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H) return;
        const d = Math.abs(r.top + r.height / 2 - H * 0.5);
        if (d < bestD) {
          bestD = d;
          best = idx;
        }
      });
      target.layer = best;
      markLayerRows();

      const step = Math.min(3, Math.floor(target.pProc * 4.0001));
      if (step !== lastStep) {
        lastStep = step;
        stepEls.forEach((el, idx) => {
          el.dataset.state = idx < step ? "done" : idx === step ? "active" : "todo";
        });
      }
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      // Phones change the viewport (URL bar, first layout) without always
      // firing resize, so the size is checked every frame.
      if (window.innerWidth !== W || window.innerHeight !== H) resize();
      if (needsMeasure || settleFrames > 0) {
        measure();
        needsMeasure = false;
        if (settleFrames > 0) settleFrames--;
        needsDraw = true;
      }

      const k = reduced ? 1 : 0.12;
      const kp = reduced ? 1 : 0.07;
      let moving = false;
      const ease = (key: keyof typeof cur, rate: number) => {
        const d = target[key] - cur[key];
        if (Math.abs(d) > 1e-4) {
          cur[key] += d * rate;
          moving = true;
        } else {
          cur[key] = target[key];
        }
      };
      ease("t", k);
      ease("turn", k);
      ease("pWork", k);
      ease("pProc", reduced ? 1 : 0.18);
      ease("px", kp);
      ease("py", kp);

      const s = cur.pProc * 4;
      const settle = (arr: number[], i: number, on: boolean, rate: number) => {
        const d = (on ? 1 : 0) - arr[i];
        if (Math.abs(d) > 1e-3) {
          arr[i] += d * (reduced ? 1 : rate);
          moving = true;
        }
      };
      for (let i = 0; i < 4; i++) settle(nodeLit, i, s > i + 0.04, 0.2);
      for (let e = 0; e < 3; e++) settle(edgeLit, e, s > e + 1, 0.2);
      const lit = activeLayer();
      for (let p = 0; p < 4; p++) settle(layerHL, p, lit === p, 0.15);

      if (!moving && !needsDraw) return;
      needsDraw = false;
      draw();
    }

    function draw() {
      if (!geo) return;
      const P = mobile ? MOBILE : DESKTOP;
      const last = P.length - 1;
      const t = Math.min(last, Math.max(0, cur.t));
      let k0 = Math.floor(t);
      let w = t - k0;
      if (k0 >= last) {
        k0 = last - 1;
        w = 1;
      }
      // Phones hold each shape in its slot and make the trip in the middle
      // stretch, so it spends as little time as possible over text.
      const e = mobile ? easeInOutCubic(clamp01((w - 0.3) / 0.4)) : easeInOutCubic(w);
      const weightOf = (st: number) => (st === k0 ? 1 - e : st === k0 + 1 ? e : 0);
      const baseUnit = mobile ? W * 0.2 : Math.min(W, H) * 0.21;
      const paramsFor = (st: number): Params => {
        const p = P[st];
        if (st === STATE_HERO && heroAnchor && !mobile && geo)
          return [heroAnchor.cx, heroAnchor.cy, (heroAnchor.headHalf + 28) / (geo.heroInner * baseUnit), p[3], p[4], p[5]];
        if (st !== STATE_ABOUT || !aboutAnchor || !geo) return p;
        // Inner edges of the braces sit a little outside the window's sides.
        const gap = mobile ? 18 : 40;
        const scaleFit = (aboutAnchor.half + gap) / (geo.braceInner * baseUnit);
        return [aboutAnchor.cx, p[1], scaleFit, p[3], p[4], p[5]];
      };
      const pa = paramsFor(k0);
      const pb = paramsFor(k0 + 1);
      const pitchBase = lerp(pa[3], pb[3], e);
      let stAlpha = lerp(pa[4], pb[4], e);
      const yawBase = lerp(pa[5], pb[5], e);
      const roll = lerp(pa[6] ?? 0, pb[6] ?? 0, e);
      const wAbout = weightOf(STATE_ABOUT);

      let ox: number;
      let oy: number;
      let scale: number;
      if (mobile && boxes.length) {
        const fit = (k: number) => {
          const b = boxes[k];
          // The braces wrap the video window; everything else fits inside its slot.
          if (k === STATE_ABOUT) return (b.w / 2 + 16) / (geo!.braceInner * baseUnit);
          // The brackets stand either side of the head in the portrait.
          if (k === STATE_HERO) return (b.w * HEAD_HALF + 14) / (geo!.heroInner * baseUnit);
          const ext = extents[k];
          return (0.88 * Math.min(b.w / 2 / ext.x, b.h / 2 / ext.y)) / baseUnit;
        };
        const ba = boxes[k0];
        const bb = boxes[k0 + 1];
        ox = lerp(ba.cx, bb.cx, e);
        oy = lerp(ba.cy, bb.cy, e);
        scale = lerp(fit(k0), fit(k0 + 1), e);
        // Fainter in transit, so the trip between slots never sits heavily on text.
        stAlpha *= 1 - 0.85 * Math.sin(Math.PI * e);
      } else {
        ox = W / 2 + lerp(pa[0], pb[0], e) * W;
        oy = H / 2 + lerp(pa[1], pb[1], e) * H;
        scale = lerp(pa[2], pb[2], e);
      }

      const wServ = weightOf(STATE_SERVICES);
      const wWork = weightOf(STATE_WORK);
      const wProc = weightOf(STATE_PROCESS);
      const wExp = weightOf(STATE_EXPERIENCE);

      // The symbol faces the reader once settled; it turns while it morphs,
      // sways with the scroll, and leans toward the pointer.
      const yaw = reduced
        ? yawBase
        : yawBase +
          Math.sin(Math.PI * e) * 0.9 +
          // The braces sway less so they never swing into the video.
          (0.2 * Math.sin(cur.turn * 2.2) + cur.px * 0.4) * (1 - 0.7 * wAbout) +
          cur.pWork * 2.6 * wWork;
      const pitch = pitchBase + (reduced ? 0 : 0.08 * Math.cos(cur.turn * 1.7) + cur.py * 0.14);
      const cyaw = Math.cos(yaw);
      const syaw = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const unit = baseUnit * scale;
      const cr = Math.cos(roll);
      const sr = Math.sin(roll);

      const project = (x0: number, y0: number, z: number) => {
        const x = x0 * cr - y0 * sr;
        const y = x0 * sr + y0 * cr;
        const x1 = x * cyaw - z * syaw;
        const z1 = x * syaw + z * cyaw;
        const y2 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const persp = CAMERA / (CAMERA - z2);
        return [ox + x1 * unit * persp, oy - y2 * unit * persp, z2] as const;
      };

      bctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx!.clearRect(0, 0, W, H);
      bctx!.lineWidth = 1;

      // Services: plane outlines, inner guides, corner struts.
      if (wServ > 0.01) {
        PLANE_Y.forEach((py, p) => {
          const c = [
            project(-PLANE_HALF, py, -PLANE_HALF),
            project(PLANE_HALF, py, -PLANE_HALF),
            project(PLANE_HALF, py, PLANE_HALF),
            project(-PLANE_HALF, py, PLANE_HALF),
          ];
          const on = layerHL[p];
          bctx!.strokeStyle = `rgba(${on > 0.5 ? ACCENT : INK},${wServ * stAlpha * (0.22 + 0.55 * on)})`;
          bctx!.beginPath();
          bctx!.moveTo(c[0][0], c[0][1]);
          for (let q = 1; q < 4; q++) bctx!.lineTo(c[q][0], c[q][1]);
          bctx!.closePath();
          bctx!.stroke();
        });
        bctx!.strokeStyle = `rgba(${INK},${wServ * stAlpha * 0.16})`;
        bctx!.setLineDash([2, 5]);
        bctx!.beginPath();
        for (const [sx, sz] of [
          [1, 1],
          [-1, 1],
          [1, -1],
          [-1, -1],
        ]) {
          const top = project(sx * PLANE_HALF, PLANE_Y[0], sz * PLANE_HALF);
          const bot = project(sx * PLANE_HALF, PLANE_Y[3], sz * PLANE_HALF);
          bctx!.moveTo(top[0], top[1]);
          bctx!.lineTo(bot[0], bot[1]);
        }
        bctx!.stroke();
        bctx!.setLineDash([]);
      }

      // Process: wires between the stages, and a pulse carrying the work forward.
      const step = Math.min(3, Math.floor(cur.pProc * 4));
      const u = cur.pProc * 4 - step;
      const pulseEdge = step < 3 ? step : -1;
      const pulsePos = u;
      if (wProc > 0.01) {
        for (let edge = 0; edge < 3; edge++) {
          const a = project(...geo.nodes[edge]);
          const b = project(...geo.nodes[edge + 1]);
          const lit = edgeLit[edge];
          bctx!.strokeStyle = `rgba(${lit > 0.5 ? ACCENT : INK},${wProc * stAlpha * (0.18 + 0.5 * lit)})`;
          bctx!.beginPath();
          bctx!.moveTo(a[0], a[1]);
          bctx!.lineTo(b[0], b[1]);
          bctx!.stroke();
        }
        if (pulseEdge >= 0 && cur.pProc > 0.001 && cur.pProc < 0.999) {
          const a = geo.nodes[pulseEdge];
          const b = geo.nodes[pulseEdge + 1];
          const [qx, qy] = project(
            a[0] + (b[0] - a[0]) * pulsePos,
            a[1] + (b[1] - a[1]) * pulsePos,
            a[2] + (b[2] - a[2]) * pulsePos,
          );
          bctx!.fillStyle = `rgba(${ACCENT},${0.14 * wProc})`;
          bctx!.beginPath();
          bctx!.arc(qx, qy, 13, 0, Math.PI * 2);
          bctx!.fill();
          bctx!.fillStyle = `rgba(${ACCENT},${wProc})`;
          bctx!.beginPath();
          bctx!.arc(qx, qy, 3.5, 0, Math.PI * 2);
          bctx!.fill();
        }
      }

      // Points.
      for (const byColor of buckets) for (const b of byColor) b.length = 0;
      const A = geo.states[k0];
      const B = geo.states[k0 + 1];
      const HA = geo.baseHighlight[k0];
      const HB = geo.baseHighlight[k0 + 1];
      const J = geo.jitter;
      const bulge = reduced ? 0 : Math.sin(Math.PI * e) * 0.55;
      const n = geo.n;

      const drawSet = (src: Float32Array, hsrc: Float32Array, mix: Float32Array | null, mixE: number, alphaMul: number) => {
        for (let i = 0; i < n; i++) {
          const i3 = i * 3;
          let x = src[i3];
          let y = src[i3 + 1];
          let z = src[i3 + 2];
          let h = hsrc[i];
          if (mix) {
            x += (mix[i3] - x) * mixE + J[i3] * bulge;
            y += (mix[i3 + 1] - y) * mixE + J[i3 + 1] * bulge;
            z += (mix[i3 + 2] - z) * mixE + J[i3 + 2] * bulge;
            h += (HB[i] - h) * mixE;
          }
          if (wServ > 0 && geo!.layerOf[i] >= 0) h += wServ * layerHL[geo!.layerOf[i]];
          if (wProc > 0) {
            const node = geo!.nodeOf[i];
            if (node >= 0) h += wProc * nodeLit[node];
            else {
              const edge = geo!.edgeOf[i];
              if (edge >= 0) {
                h += wProc * edgeLit[edge] * 0.35;
                if (edge === pulseEdge) {
                  const d = geo!.edgeT[i] - pulsePos;
                  h += wProc * 1.2 * Math.exp(-(d * d) / 0.006);
                }
              }
            }
          }

          if (roll !== 0) {
            const xr = x * cr - y * sr;
            y = x * sr + y * cr;
            x = xr;
          }
          const x1 = x * cyaw - z * syaw;
          const z1 = x * syaw + z * cyaw;
          const y2 = y * cp - z1 * sp;
          const z2 = y * sp + z1 * cp;
          const persp = CAMERA / (CAMERA - z2);
          const sx = ox + x1 * unit * persp;
          const sy = oy - y2 * unit * persp;
          if (sx < -20 || sx > W + 20 || sy < -20 || sy > H + 20) continue;

          const depth = clamp01((z2 + 2.3) / 4.6);
          const alpha = (0.3 + 0.7 * depth) * stAlpha * alphaMul;
          const size = 0.9 + 1.2 * depth + Math.min(1, h) * 0.9;
          const color = h > 0.45 ? 1 : 0;
          if (alpha > 0.02) buckets[color][Math.min(ALPHA_STEPS - 1, Math.floor(alpha * ALPHA_STEPS))].push(sx, sy, size);
        }
      };

      if (reduced && B) {
        // Reduced motion: crossfade the two states instead of moving points.
        drawSet(A, HA, null, 0, 1 - e);
        drawSet(B, HB, null, 0, e);
      } else {
        drawSet(A, HA, B ?? null, e, 1);
      }

      buckets.forEach((byColor, color) => {
        byColor.forEach((list, ai) => {
          if (!list.length) return;
          bctx!.fillStyle = `rgba(${color ? ACCENT : INK},${(ai + 0.5) / ALPHA_STEPS})`;
          bctx!.beginPath();
          for (let q = 0; q < list.length; q += 3) {
            const r = list[q + 2];
            bctx!.rect(list[q] - r / 2, list[q + 1] - r / 2, r, r);
          }
          bctx!.fill();
        });
      });

      // Labels anchored to the geometry. A label that would run off the right
      // edge flips to the left of its anchor instead.
      const place = (el: HTMLElement, lx: number, ly: number, gap: number) => {
        const width = labelWidths.get(el) ?? 120;
        const left = lx + gap + width > W - 12;
        const x = left ? lx - gap - width : lx + gap;
        el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(ly)}px, 0)`;
      };
      planeLabels.forEach((el, p) => {
        if (wServ < 0.01) {
          el.style.opacity = "0";
          return;
        }
        let best = project(PLANE_HALF, PLANE_Y[p], PLANE_HALF);
        for (const [sx, sz] of [
          [1, -1],
          [-1, 1],
          [-1, -1],
        ]) {
          const c = project(sx * PLANE_HALF, PLANE_Y[p], sz * PLANE_HALF);
          if (c[0] > best[0]) best = c;
        }
        place(el, best[0], best[1] - 8, 12);
        el.style.opacity = String(wServ * (0.6 + 0.4 * layerHL[p]));
        el.dataset.active = layerHL[p] > 0.5 ? "true" : "false";
      });
      gitLabels.forEach((el) => {
        if (wExp < 0.01) {
          el.style.opacity = "0";
          return;
        }
        const idx = Number(el.dataset.git);
        const c = geo!.commits[idx];
        const [lx, ly] = project(c[0], c[1], c[2]);
        place(el, lx, ly - 9, 18);
        el.style.opacity = String(wExp * stAlpha);
      });
    }

    const onScroll = () => {
      needsMeasure = true;
      settleFrames = 3;
    };
    const onPointer = (ev: PointerEvent) => {
      target.px = ev.clientX / W - 0.5;
      target.py = ev.clientY / H - 0.5;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    workStage?.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer && !reduced) window.addEventListener("pointermove", onPointer, { passive: true });
    // Hovering a service lights its layer of the stack (mouse only; phones follow the scroll).
    const hoverOff: (() => void)[] = [];
    if (finePointer) {
      layerRows.forEach((row, idx) => {
        const enter = () => {
          hoverLayer = idx;
          markLayerRows();
        };
        const leave = () => {
          if (hoverLayer === idx) hoverLayer = -1;
          markLayerRows();
        };
        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);
        hoverOff.push(() => {
          row.removeEventListener("pointerenter", enter);
          row.removeEventListener("pointerleave", leave);
        });
      });
    }
    const ro = new ResizeObserver(() => {
      needsMeasure = true;
      needsDraw = true;
    });
    ro.observe(document.body);
    // Glyph states are rasterised from the mono face, so rebuild once it loads.
    document.fonts?.ready.then(() => {
      rebuild();
      measureLabels();
    });
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      workStage?.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      hoverOff.forEach((off) => off());
      ro.disconnect();
    };
  }, []);

  return (
    <>
      <div className="backdrop" ref={rootRef} aria-hidden="true">
        <canvas className="backdrop__canvas" ref={backRef} />
        <div className="backdrop__labels">
          {services.map((s, i) => (
            <span className="backdrop__label" data-plane={i} key={s.layer}>
              {s.layer}
            </span>
          ))}
          {/* git graph: HEAD is commit 5 on main, the branch's middle commit is 7 */}
          <span className="backdrop__label backdrop__label--head" data-git={5}>
            main · {experience[0]?.org}
          </span>
          <span className="backdrop__label" data-git={7}>
            {experience[1]?.org.toLowerCase()}
          </span>
        </div>
      </div>
    </>
  );
}
