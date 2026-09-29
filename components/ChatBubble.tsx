"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { clone } from "@/content/clone";
import { media, personal } from "@/content/site";

type Message = { role: "user" | "assistant"; content: string };
type Status = "idle" | "streaming" | "offline" | "error" | "limited";

// The AI twin: a bubble in the bottom-right corner that opens a small chat.
// Replies stream from /api/chat (see app/api/chat/route.ts).
export function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: clone.ui.greeting }]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const panelId = useId();
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        bubbleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || status === "streaming") return;
    const history: Message[] = [...messages, { role: "user", content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setStatus("streaming");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The greeting is UI only; the server drops leading assistant turns.
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const code = res.status === 503 ? "offline" : res.status === 429 ? "limited" : "error";
        setMessages(history);
        setStatus(code);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: reply }]);
      }
      if (!reply.trim()) {
        setMessages(history);
        setStatus("error");
        return;
      }
      setStatus("idle");
    } catch {
      setMessages(history);
      setStatus("error");
    }
  }

  const notice =
    status === "offline" ? clone.ui.offline : status === "limited" ? clone.ui.limited : status === "error" ? clone.ui.error : null;
  const showSuggestions = messages.length === 1 && status === "idle";

  return (
    <div className="twin" data-open={open ? "true" : "false"}>
      {open ? (
        <div className="twin__panel" id={panelId} role="dialog" aria-label={clone.ui.title}>
          <header className="twin__head">
            <Image className="twin__avatar" src={media.avatar} alt="" width={40} height={40} />
            <div className="twin__who">
              <p className="twin__title">{clone.ui.title}</p>
              <p className="twin__sub">{clone.ui.subtitle}</p>
            </div>
            <button
              className="twin__close"
              type="button"
              aria-label={clone.ui.close}
              onClick={() => {
                setOpen(false);
                bubbleRef.current?.focus();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="twin__log" ref={logRef} aria-live="polite">
            {messages.map((m, i) => (
              <p className={`twin__msg twin__msg--${m.role}`} key={i}>
                {m.content || <span className="twin__typing" aria-label="Typing" />}
              </p>
            ))}
            {notice ? (
              <p className="twin__notice" role="status">
                {notice}{" "}
                <a className="text-link" href={`mailto:${personal.email}`}>
                  {personal.email}
                </a>
              </p>
            ) : null}
            {showSuggestions ? (
              <div className="twin__suggestions">
                {clone.ui.suggestions.map((s) => (
                  <button type="button" key={s} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form
            className="twin__form"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={800}
              placeholder={clone.ui.placeholder}
              aria-label={clone.ui.placeholder}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <button className="twin__send" type="submit" aria-label={clone.ui.send} disabled={status === "streaming" || !input.trim()}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>
        </div>
      ) : null}

      <button
        ref={bubbleRef}
        className="twin__bubble"
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="twin__bubble-face">
          <Image src={media.avatar} alt="" width={40} height={40} />
          <span className="twin__online" aria-hidden="true" />
        </span>
        <span className="twin__bubble-label">{open ? clone.ui.close : clone.ui.bubbleLabel}</span>
      </button>
    </div>
  );
}
