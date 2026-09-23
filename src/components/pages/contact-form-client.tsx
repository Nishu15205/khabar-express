"use client";

import { useState } from "react";
import { Send, LoaderCircle, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * संपर्क पृष्ठ का फॉर्म — /api/contact को POST करके संदेश DB में सहेजता है।
 */
export function ContactFormClient({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );
  const [feedback, setFeedback] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setFeedback("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: from, message }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string; error?: string };

      if (res.ok && json.ok) {
        setStatus("ok");
        setFeedback(json.message ?? "आपका संदेश प्राप्त हो गया है।");
        setName("");
        setFrom("");
        setMessage("");
      } else {
        setStatus("error");
        setFeedback(json.error ?? "संदेश भेजा नहीं जा सका। कृपया फिर कोशिश करें।");
      }
    } catch {
      setStatus("error");
      setFeedback("नेटवर्क समस्या — कृपया इंटरनेट जांचकर फिर कोशिश करें।");
    }
  }

  const inputCls =
    "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border bg-background p-4 sm:p-5"
      aria-label="संपर्क फॉर्म"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="cf-name" className="text-sm font-medium">
            आपका नाम <span className="text-destructive">*</span>
          </label>
          <input
            id="cf-name"
            required
            minLength={2}
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="जैसे: रमेश कुमार"
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cf-email" className="text-sm font-medium">
            ईमेल <span className="text-destructive">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            required
            maxLength={120}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder={`जैसे: aap@example.com`}
            className={inputCls}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="cf-message" className="text-sm font-medium">
          संदेश <span className="text-destructive">*</span>
        </label>
        <textarea
          id="cf-message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="अपनी बात विस्तार से लिखें (कम से कम 10 अक्षर)…"
          className={`${inputCls} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
          {status === "sending" ? "भेजा जा रहा है…" : "संदेश भेजें"}
        </button>

        <p className="text-xs text-muted-foreground">
          या सीधे ईमेल करें:{" "}
          <a className="underline underline-offset-2" href={`mailto:${email}`}>
            {email}
          </a>
        </p>
      </div>

      {status === "ok" && feedback ? (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-green-600/30 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {feedback}
        </p>
      ) : null}
      {status === "error" && feedback ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
