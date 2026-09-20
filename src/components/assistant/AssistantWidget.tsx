"use client";

import { useEffect, useRef, useState } from "react";
import { useAssistant } from "./AssistantProvider";
import { SaveAndResumeForm } from "./SaveAndResumeForm";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-brand-neutral-100 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-neutral-500"
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}

export function AssistantWidget() {
  const {
    open,
    setOpen,
    messages,
    typing,
    sendUserMessage,
    dismissMessage,
    showSaveAndResume,
    submitSaveAndResume,
    declineSaveAndResume,
  } = useAssistant();

  const [draft, setDraft] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);
  const visibleMessages = messages.filter((m) => !m.dismissed);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleMessages.length, typing, showSaveAndResume]);

  const hasUnread = !open && visibleMessages.length > 0;

  function handleSend() {
    if (!draft.trim()) return;
    sendUserMessage(draft);
    setDraft("");
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-brand-neutral-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-brand-neutral-200 bg-brand-navy-900 px-4 py-3">
            <p className="text-sm font-medium text-white">Quote assistant</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant panel"
              className="text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div ref={threadRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {visibleMessages.length === 0 ? (
              <p className="text-sm text-brand-neutral-500">
                Ask me anything about your quote, or say the word if you&rsquo;d rather just chat
                through the whole thing.
              </p>
            ) : null}
            {visibleMessages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`group relative max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-brand-green-600 text-white"
                      : "bg-brand-neutral-100 text-brand-navy-900"
                  }`}
                >
                  {m.text}
                  {m.dismissible ? (
                    <button
                      type="button"
                      onClick={() => dismissMessage(m.id)}
                      aria-label="Dismiss"
                      className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-white text-xs text-brand-neutral-500 shadow group-hover:flex"
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {typing ? <TypingIndicator /> : null}
            {showSaveAndResume ? (
              <SaveAndResumeForm onSubmit={submitSaveAndResume} onDecline={declineSaveAndResume} />
            ) : null}
          </div>

          <div className="flex items-center gap-2 border-t border-brand-neutral-200 p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Type a message…"
              className="w-full rounded-full border border-brand-neutral-300 px-4 py-2 text-sm text-brand-navy-900 focus:border-brand-green-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-green-600 text-white disabled:opacity-40"
              aria-label="Send"
            >
              →
            </button>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy-900 text-white shadow-lg transition-transform hover:scale-105"
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {hasUnread ? (
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-brand-green-500 ring-2 ring-white" />
        ) : null}
        💬
      </button>
    </div>
  );
}
