"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PremiumResult } from "@/lib/pricing/types";

type Vertical = "trades" | "consultants";

type AssistantEventKind =
  | "inactivity_nudge"
  | "clarify_nudge"
  | "confusion_nudge"
  | "post_quote_offer"
  | "leave_intent_offer"
  | "nudge_dismissed"
  | "chat_quote_started"
  | "chat_quote_completed";

export type ChatThreadMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  dismissible?: boolean;
  dismissed?: boolean;
};

type AssistantContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  messages: ChatThreadMessage[];
  typing: boolean;
  chatQuoteResult: { vertical: Vertical; premium: PremiumResult } | null;
  clearChatQuoteResult: () => void;
  reportStep: (vertical: Vertical, questionId: string, questionText: string) => void;
  reportClassifyStruggle: (vertical: Vertical, questionText: string, rawText: string) => void;
  reportConfusion: (vertical: Vertical, questionText: string, rawText: string) => void;
  reportQuoteCompleted: (vertical: Vertical, annualGBP: number) => void;
  startChatQuote: () => void;
  sendUserMessage: (text: string) => void;
  dismissMessage: (id: string) => void;
  submitSaveAndResume: (email: string) => Promise<void>;
  declineSaveAndResume: () => void;
  showSaveAndResume: boolean;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used within AssistantProvider");
  return ctx;
}

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

const INACTIVITY_DELAY_MS = 20000;
const GLOBAL_IDLE_THRESHOLD_MS = 45000;

export function AssistantProvider({ children }: { children: ReactNode }) {
  const sessionIdRef = useRef<string | null>(null);
  if (sessionIdRef.current == null) sessionIdRef.current = uid();
  const sessionId = sessionIdRef.current;

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatThreadMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [chatQuoteResult, setChatQuoteResult] = useState<{
    vertical: Vertical;
    premium: PremiumResult;
  } | null>(null);
  const [showSaveAndResume, setShowSaveAndResume] = useState(false);

  const currentVerticalRef = useRef<Vertical | null>(null);
  const shownNudgeKeys = useRef<Set<string>>(new Set());
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveIntentOfferedRef = useRef(false);
  const formStartedRef = useRef(false);
  const quoteDoneRef = useRef(false);
  const lastActivityRef = useRef(0);
  const messagesRef = useRef<ChatThreadMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const logEvent = useCallback(
    (kind: AssistantEventKind, vertical: Vertical | null) => {
      fetch("/api/assistant/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, kind, vertical }),
      }).catch(() => {});
    },
    [sessionId],
  );

  const addNudge = useCallback(
    (dedupeKey: string, kind: AssistantEventKind, text: string) => {
      if (shownNudgeKeys.current.has(dedupeKey)) return;
      shownNudgeKeys.current.add(dedupeKey);
      setMessages((m) => [...m, { id: uid(), role: "assistant", text, dismissible: true }]);
      setOpen(true);
      logEvent(kind, currentVerticalRef.current);
    },
    [logEvent],
  );

  const reportStep = useCallback(
    (vertical: Vertical, questionId: string, questionText: string) => {
      currentVerticalRef.current = vertical;
      formStartedRef.current = true;
      lastActivityRef.current = Date.now();

      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      const dedupeKey = `inactivity:${vertical}:${questionId}`;
      if (shownNudgeKeys.current.has(dedupeKey)) return;

      inactivityTimerRef.current = setTimeout(async () => {
        try {
          const res = await fetch("/api/assistant/nudge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "inactivity", vertical, questionText }),
          });
          const data = (await res.json()) as { message?: string };
          if (data.message) addNudge(dedupeKey, "inactivity_nudge", data.message);
        } catch {
          // no nudge if the request itself fails
        }
      }, INACTIVITY_DELAY_MS);
    },
    [addNudge],
  );

  const reportClassifyStruggle = useCallback(
    (vertical: Vertical, questionText: string, rawText: string) => {
      currentVerticalRef.current = vertical;
      const dedupeKey = `clarify:${vertical}`;
      if (shownNudgeKeys.current.has(dedupeKey)) return;
      (async () => {
        try {
          const res = await fetch("/api/assistant/nudge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "clarify", vertical, questionText, rawText }),
          });
          const data = (await res.json()) as { message?: string };
          if (data.message) addNudge(dedupeKey, "clarify_nudge", data.message);
        } catch {
          // no nudge if the request itself fails
        }
      })();
    },
    [addNudge],
  );

  const reportConfusion = useCallback(
    (vertical: Vertical, questionText: string, rawText: string) => {
      currentVerticalRef.current = vertical;
      const dedupeKey = `confusion:${vertical}:${questionText}`;
      if (shownNudgeKeys.current.has(dedupeKey)) return;
      (async () => {
        try {
          const res = await fetch("/api/assistant/nudge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "confusion", vertical, questionText, rawText }),
          });
          const data = (await res.json()) as { message?: string };
          if (data.message) addNudge(dedupeKey, "confusion_nudge", data.message);
        } catch {
          // no nudge if the request itself fails
        }
      })();
    },
    [addNudge],
  );

  const reportQuoteCompleted = useCallback(
    (vertical: Vertical, annualGBP: number) => {
      if (quoteDoneRef.current) return;
      quoteDoneRef.current = true;
      (async () => {
        try {
          const res = await fetch("/api/assistant/nudge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "post_quote", vertical, annualGBP }),
          });
          const data = (await res.json()) as { message?: string };
          if (data.message) addNudge(`post_quote:${vertical}`, "post_quote_offer", data.message);
        } catch {
          // no nudge if the request itself fails
        }
      })();
    },
    [addNudge],
  );

  // Global inactivity + leave-intent detection (trigger c).
  useEffect(() => {
    lastActivityRef.current = Date.now();

    function markActivity() {
      lastActivityRef.current = Date.now();
    }

    function fireLeaveIntent() {
      if (leaveIntentOfferedRef.current || !formStartedRef.current || quoteDoneRef.current) return;
      leaveIntentOfferedRef.current = true;
      (async () => {
        try {
          const res = await fetch("/api/assistant/nudge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind: "leave_intent", vertical: currentVerticalRef.current }),
          });
          const data = (await res.json()) as { message?: string };
          if (data.message) {
            addNudge("leave_intent", "leave_intent_offer", data.message);
            setShowSaveAndResume(true);
          }
        } catch {
          // no nudge if the request itself fails
        }
      })();
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") fireLeaveIntent();
    }
    function onMouseOut(e: MouseEvent) {
      if (e.clientY <= 0) fireLeaveIntent();
    }

    window.addEventListener("pointerdown", markActivity);
    window.addEventListener("keydown", markActivity);
    window.addEventListener("scroll", markActivity, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("mouseout", onMouseOut);

    const idleCheck = setInterval(() => {
      if (Date.now() - lastActivityRef.current > GLOBAL_IDLE_THRESHOLD_MS) fireLeaveIntent();
    }, 5000);

    return () => {
      window.removeEventListener("pointerdown", markActivity);
      window.removeEventListener("keydown", markActivity);
      window.removeEventListener("scroll", markActivity);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("mouseout", onMouseOut);
      clearInterval(idleCheck);
    };
  }, [addNudge]);

  const startChatQuote = useCallback(() => {
    setOpen(true);
    logEvent("chat_quote_started", currentVerticalRef.current);
    setMessages((m) => [
      ...m,
      {
        id: uid(),
        role: "assistant",
        text: "Sure — tell me a bit about what you do and I'll work out a quote as we chat. You can switch back to the step-by-step form at any time.",
      },
    ]);
  }, [logEvent]);

  const sendUserMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const userMsg: ChatThreadMessage = { id: uid(), role: "user", text: trimmed };
      setMessages((m) => [...m, userMsg]);
      setOpen(true);
      setTyping(true);

      (async () => {
        const history = [...messagesRef.current, userMsg]
          .filter((m) => !m.dismissed)
          .map((m) => ({ role: m.role, content: m.text }));

        try {
          const res = await fetch("/api/assistant/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vertical: currentVerticalRef.current, messages: history }),
          });
          const data = (await res.json()) as {
            reply?: string;
            vertical?: Vertical;
            quoteCompleted?: { vertical: Vertical; premium: PremiumResult };
          };
          if (data.vertical) currentVerticalRef.current = data.vertical;
          setMessages((m) => [
            ...m,
            { id: uid(), role: "assistant", text: data.reply || "Could you tell me a bit more?" },
          ]);
          if (data.quoteCompleted) {
            setChatQuoteResult(data.quoteCompleted);
            quoteDoneRef.current = true;
            logEvent("chat_quote_completed", data.quoteCompleted.vertical);
          }
        } catch {
          setMessages((m) => [
            ...m,
            { id: uid(), role: "assistant", text: "Sorry, something went wrong there — please try again." },
          ]);
        } finally {
          setTyping(false);
        }
      })();
    },
    [logEvent],
  );

  const dismissMessage = useCallback(
    (id: string) => {
      setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, dismissed: true } : msg)));
      logEvent("nudge_dismissed", currentVerticalRef.current);
    },
    [logEvent],
  );

  const submitSaveAndResume = useCallback(async (email: string) => {
    await fetch("/api/assistant/save-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, vertical: currentVerticalRef.current, step: formStartedRef.current ? 1 : 0 }),
    }).catch(() => {});
    setShowSaveAndResume(false);
    setMessages((m) => [
      ...m,
      {
        id: uid(),
        role: "assistant",
        text: `Got it — this demo isn't connected to a real email service yet, so we've just noted it down rather than actually sending anything to ${email}. For now, keep this tab open or bookmark it to come back.`,
      },
    ]);
  }, []);

  const declineSaveAndResume = useCallback(() => setShowSaveAndResume(false), []);

  const clearChatQuoteResult = useCallback(() => setChatQuoteResult(null), []);

  const value = useMemo<AssistantContextValue>(
    () => ({
      open,
      setOpen,
      messages,
      typing,
      chatQuoteResult,
      clearChatQuoteResult,
      reportStep,
      reportClassifyStruggle,
      reportConfusion,
      reportQuoteCompleted,
      startChatQuote,
      sendUserMessage,
      dismissMessage,
      submitSaveAndResume,
      declineSaveAndResume,
      showSaveAndResume,
    }),
    [
      open,
      messages,
      typing,
      chatQuoteResult,
      clearChatQuoteResult,
      reportStep,
      reportClassifyStruggle,
      reportConfusion,
      reportQuoteCompleted,
      startChatQuote,
      sendUserMessage,
      dismissMessage,
      submitSaveAndResume,
      declineSaveAndResume,
      showSaveAndResume,
    ],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}
