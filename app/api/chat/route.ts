import Anthropic from "@anthropic-ai/sdk";
import { buildTwinPrompt } from "@/lib/twin-prompt";

// The AI twin's backend. Streams plain text back to the chat bubble.
// Needs ANTHROPIC_API_KEY; CHAT_MODEL optionally overrides the model.

const MODEL = process.env.CHAT_MODEL || "claude-sonnet-5-5";
const MAX_TURNS = 12; // messages of history sent to the model
const MAX_CHARS = 800; // per visitor message
const RATE_LIMIT = 20; // messages per visitor...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ...per ten minutes

const SYSTEM = buildTwinPrompt();

// Best-effort, per server instance. Enough to stop one visitor running up the bill.
const hits = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > RATE_LIMIT;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function clean(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages;
  const messages = raw
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string" &&
        (m as ChatMessage).content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_TURNS);
  // The API needs the conversation to start with the visitor and end with them.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: "offline" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ error: "limited" }, { status: 429 });

  let messages: ChatMessage[] | null = null;
  try {
    messages = clean(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return Response.json({ error: "bad_request" }, { status: 400 });

  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const reply = client.messages.stream({
          model: MODEL,
          max_tokens: 400,
          // The prompt is the same for every visitor, so it is cached.
          system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
          messages,
        });
        for await (const event of reply) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        console.error("AI twin request failed:", err);
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
