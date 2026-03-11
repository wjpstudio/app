"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("dashboard_auth="));
    if (token) {
      router.push("/dashboard");
      return;
    }

    // Check URL for OAuth errors
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err === "not_authorized") setError("ACCESS DENIED");
    else if (err) setError("AUTH FAILED");

    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="pixel-loader w-16" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      {/* CRT vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      <div className="relative z-20 w-full max-w-xs space-y-8 px-6">
        {/* Logo */}
        <div className="text-center">
          <h1 className="font-mono text-2xl tracking-[0.4em] text-foreground glitch-text">
            WJP
          </h1>
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted/40 mt-2 uppercase">
            Studio
          </p>
        </div>

        {/* Discord sign-in */}
        <div className="space-y-4">
          <a
            href="/api/auth/discord"
            className="w-full flex items-center justify-center gap-3 border border-border py-3 px-4 font-mono text-[10px] tracking-[0.3em] uppercase text-muted hover:text-foreground hover:border-[#5865F2]/50 transition-colors glitch-hover"
          >
            <svg width="16" height="12" viewBox="0 0 71 55" fill="currentColor">
              <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.8 40.8 0 00-1.8 3.7 54 54 0 00-16.2 0A38 38 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 4.9a.2.2 0 00-.1.1C1.5 18.7-.9 32.2.3 45.5v.1a58.9 58.9 0 0017.7 9a.2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.8 38.8 0 01-5.5-2.7.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 42 42 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .3 36.4 36.4 0 01-5.5 2.7.2.2 0 00-.1.4 47.2 47.2 0 003.6 5.8.2.2 0 00.2.1 58.7 58.7 0 0017.8-9v-.1c1.4-15-2.3-28.4-9.8-40.1a.2.2 0 00-.1-.1zM23.7 37.3c-3.5 0-6.3-3.2-6.3-7.1s2.8-7.1 6.3-7.1 6.4 3.2 6.3 7.1c0 3.9-2.8 7.1-6.3 7.1zm23.2 0c-3.5 0-6.3-3.2-6.3-7.1s2.8-7.1 6.3-7.1 6.4 3.2 6.3 7.1c0 3.9-2.7 7.1-6.3 7.1z" />
            </svg>
            Sign in with Discord
          </a>

          {error && (
            <p className="font-mono text-[10px] text-red-500 text-center tracking-wider">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
