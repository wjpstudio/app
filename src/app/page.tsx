"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("dashboard_auth="));
    if (token) {
      router.push("/dashboard");
    }
    setChecking(false);
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);

    const res = await fetch("/api/dashboard-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError(true);
      setPassword("");
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="pixel-loader w-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      {/* CRT vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div className="relative z-20 w-full max-w-xs space-y-8 px-6">
        {/* Logo — monospace, pixel-precise */}
        <div className="text-center">
          <h1 className="font-mono text-2xl tracking-[0.4em] text-foreground glitch-text">
            WJP
          </h1>
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted/40 mt-2 uppercase">
            Studio
          </p>
        </div>

        {/* Password field */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="·····"
              autoFocus
              className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted/30 text-center tracking-[0.2em] focus:outline-none focus:border-accent/50 transition-colors"
            />
            {/* Blinking cursor indicator */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-[6px] h-[10px] bg-accent/50 cursor-blink pixel-render" />
          </div>

          {error && (
            <p className="font-mono text-[10px] text-red-500 text-center tracking-wider">
              ACCESS DENIED
            </p>
          )}

          <button
            type="submit"
            className="w-full border border-border py-3 font-mono text-[10px] tracking-[0.3em] uppercase text-muted hover:text-foreground hover:border-accent/50 transition-colors glitch-hover"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
