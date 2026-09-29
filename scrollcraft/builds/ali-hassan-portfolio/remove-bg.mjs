// Removes a photo's background with kie.ai (recraft/remove-background).
// Usage: set -a; . ./.env.local; set +a; node scrollcraft/builds/ali-hassan-portfolio/remove-bg.mjs <in.jpg> <out.png>
import fs from "node:fs";
const KEY = process.env.KIE_AI_API_KEY;
const H = { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` };
const [file, out] = process.argv.slice(2);
const b64 = `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
const up = await (await fetch("https://kieai.redpandaai.co/api/file-base64-upload", { method: "POST", headers: H, body: JSON.stringify({ base64Data: b64, uploadPath: "scrollcraft", fileName: "head.jpg" }) })).json();
const url = up?.data?.downloadUrl || up?.data?.fileUrl;
const c = await (await fetch("https://api.kie.ai/api/v1/jobs/createTask", { method: "POST", headers: H, body: JSON.stringify({ model: "recraft/remove-background", input: { image: url } }) })).json();
console.log("create", JSON.stringify(c));
const id = c?.data?.taskId; if (!id) process.exit(1);
for (let i = 0; i < 90; i++) {
  await new Promise(r => setTimeout(r, 4000));
  const j = await (await fetch(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${id}`, { headers: H })).json();
  const s = j?.data?.state;
  if (s === "success") { const r = JSON.parse(j.data.resultJson); const u = r.resultUrls[0]; fs.writeFileSync(out, Buffer.from(await (await fetch(u)).arrayBuffer())); console.log("ok", out); process.exit(0); }
  if (s === "fail") { console.log("fail", JSON.stringify(j.data)); process.exit(1); }
}
