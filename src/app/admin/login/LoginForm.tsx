"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!password) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Login failed — please try again.");
    } catch {
      setError("Login failed — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mt-6">
      <label className="text-sm font-medium text-brand-neutral-700" htmlFor="admin-password">
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
        className="mt-2 w-full rounded-lg border border-brand-neutral-300 px-3 py-2 text-sm text-brand-navy-900 focus:border-brand-green-600 focus:outline-none"
        autoFocus
      />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4">
        <Button disabled={!password || submitting} onClick={handleSubmit} className="w-full">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </div>
    </Card>
  );
}
