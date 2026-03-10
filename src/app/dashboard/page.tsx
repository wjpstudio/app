"use client";

import { useState, useEffect, useCallback } from "react";
import { PixelDivider } from "@/components/PixelDivider";

const MC_BASE = "https://kikaionchain.github.io/mission-control";
const BASE_RPC = "https://mainnet.base.org";
const SOL_RPC = "https://solana-rpc.publicnode.com";
const TREASURY_BASE = "0x51e0c3cb17e8AAb6391F40468A34E8E94aa1166E";
const TREASURY_SOL = "DPe3WqzeJisHPj4LyjRNcVgtUYUzJmmC4LkvUifadaLm";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const COINGECKO = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana&vs_currencies=usd";

interface AgentData {
  status: string;
  workingOn: string;
  contextPct: number | null;
  model: string;
  sessionDurationMin: number | null;
  lastActivityMin: number | null;
  rateLimit: boolean;
}

interface UsageAgent {
  allModels: number | null;
  sonnet: number | null;
  opus: number | null;
  updatedAt: string | null;
  note?: string;
}

interface KodoData {
  activeTask: string;
  recentOutputs: { file: string; lines: number; summary: string }[];
  cronJobs: { name: string; schedule: string; status: string }[];
}

interface NeedsWjpItem {
  priority: string;
  title: string;
  ask: string;
  impact: string;
  dateAdded: string;
}

interface Treasury {
  eth: string;
  ethUsd: string;
  usdcBase: string;
  sol: string;
  solUsd: string;
  usdcSol: string;
  total: string;
}

// ── Auth Gate ────────────────────────────────────────────
function LoginForm({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    const res = await fetch("/api/dashboard-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      onAuth();
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-6">
        <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase text-center">
          Dashboard
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full bg-surface border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
        />
        {error && (
          <p className="font-mono text-xs text-red-500 text-center">
            Wrong password
          </p>
        )}
        <button
          type="submit"
          className="w-full border border-foreground text-foreground py-3 font-mono text-xs tracking-widest uppercase hover:bg-foreground hover:text-bg transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

// ── Status Dot ───────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
  const color =
    status === "active"
      ? "bg-accent"
      : status === "ssh-only"
        ? "bg-foreground/30"
        : "bg-foreground/10";
  return <span className={`inline-block w-2 h-2 ${color}`} />;
}

// ── Usage Bar ────────────────────────────────────────────
function UsageBar({ label, pct }: { label: string; pct: number | null }) {
  if (pct === null) return null;
  const color = pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-accent";
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] text-muted w-16 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-1 bg-border">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[10px] text-muted w-8 text-right">
        {pct}%
      </span>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────
function Dashboard() {
  const [agents, setAgents] = useState<Record<string, AgentData>>({});
  const [usage, setUsage] = useState<Record<string, UsageAgent>>({});
  const [usageResets, setUsageResets] = useState<string>("");
  const [kodo, setKodo] = useState<KodoData | null>(null);
  const [needsWjp, setNeedsWjp] = useState<NeedsWjpItem[]>([]);
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      // MC data
      const [dataRes, usageRes, kodoRes, needsRes] = await Promise.allSettled([
        fetch(`${MC_BASE}/data.json`),
        fetch(`${MC_BASE}/data/usage.json`),
        fetch(`${MC_BASE}/data/kodo.json`),
        fetch(`${MC_BASE}/needs-wjp.json`),
      ]);

      if (dataRes.status === "fulfilled" && dataRes.value.ok) {
        const d = await dataRes.value.json();
        setAgents(d.agents || {});
        setLastUpdate(d.updatedAt || "");
      }

      if (usageRes.status === "fulfilled" && usageRes.value.ok) {
        const u = await usageRes.value.json();
        setUsage(u.agents || {});
        setUsageResets(u.weekResets || "");
      }

      if (kodoRes.status === "fulfilled" && kodoRes.value.ok) {
        const k = await kodoRes.value.json();
        setKodo(k);
      }

      if (needsRes.status === "fulfilled" && needsRes.value.ok) {
        const n = await needsRes.value.json();
        setNeedsWjp(n.items || []);
      }

      // Treasury
      await fetchTreasury();
    } catch {
      // Silently fail — dashboard shows stale data
    }
  }, []);

  async function fetchTreasury() {
    try {
      const [ethRes, usdcRes, solRes, priceRes] = await Promise.allSettled([
        // ETH balance on Base
        fetch(BASE_RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [TREASURY_BASE, "latest"],
          }),
        }),
        // USDC on Base (ERC-20 balanceOf)
        fetch(BASE_RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "eth_call",
            params: [
              {
                to: USDC_BASE,
                data: `0x70a08231000000000000000000000000${TREASURY_BASE.slice(2)}`,
              },
              "latest",
            ],
          }),
        }),
        // SOL balance
        fetch(SOL_RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 3,
            method: "getBalance",
            params: [TREASURY_SOL],
          }),
        }),
        // Prices
        fetch(COINGECKO),
      ]);

      const prices =
        priceRes.status === "fulfilled" && priceRes.value.ok
          ? await priceRes.value.json()
          : { ethereum: { usd: 0 }, solana: { usd: 0 } };

      const ethBal =
        ethRes.status === "fulfilled" && ethRes.value.ok
          ? parseInt((await ethRes.value.json()).result, 16) / 1e18
          : 0;

      const usdcBaseBal =
        usdcRes.status === "fulfilled" && usdcRes.value.ok
          ? parseInt((await usdcRes.value.json()).result, 16) / 1e6
          : 0;

      const solBal =
        solRes.status === "fulfilled" && solRes.value.ok
          ? (await solRes.value.json()).result?.value / 1e9
          : 0;

      const ethUsd = ethBal * (prices.ethereum?.usd || 0);
      const solUsd = solBal * (prices.solana?.usd || 0);
      const total = ethUsd + usdcBaseBal + solUsd;

      setTreasury({
        eth: ethBal.toFixed(4),
        ethUsd: `$${ethUsd.toFixed(2)}`,
        usdcBase: `$${usdcBaseBal.toFixed(2)}`,
        sol: solBal.toFixed(4),
        solUsd: `$${solUsd.toFixed(2)}`,
        usdcSol: "$0.00",
        total: `$${total.toFixed(2)}`,
      });
    } catch {
      // Treasury fetch failed — show dashes
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5 * 60 * 1000); // 5 min
    return () => clearInterval(interval);
  }, [fetchData]);

  const agentOrder = ["kikai", "yama", "kodo", "claud"];

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Header */}
      <section className="pt-32 pb-8">
        <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase mb-4">
          Dashboard
        </p>
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-light tracking-tight text-foreground">
            Mission Control
          </h1>
          <span className="font-mono text-[10px] text-muted/40">
            {lastUpdate ? `updated ${new Date(lastUpdate).toLocaleTimeString()}` : "—"}
          </span>
        </div>
      </section>

      <PixelDivider accent />

      {/* Agent Status */}
      <section className="py-8">
        <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-6">
          Agents
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1px] bg-border">
          {agentOrder.map((name) => {
            const agent = agents[name];
            const u = usage[name];
            return (
              <div key={name} className="bg-surface p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <StatusDot status={agent?.status || "offline"} />
                    <span className="font-mono text-sm text-foreground capitalize">
                      {name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-muted/50 uppercase tracking-wider">
                    {agent?.status || "offline"}
                  </span>
                </div>

                {agent && (
                  <div className="space-y-1.5 mb-3">
                    <div className="flex justify-between">
                      <span className="font-mono text-[10px] text-muted">
                        Task
                      </span>
                      <span className="font-mono text-[10px] text-foreground/70 max-w-[200px] truncate text-right">
                        {agent.workingOn || "idle"}
                      </span>
                    </div>
                    {agent.contextPct !== null && (
                      <div className="flex justify-between">
                        <span className="font-mono text-[10px] text-muted">
                          Context
                        </span>
                        <span
                          className={`font-mono text-[10px] ${
                            agent.contextPct >= 80
                              ? "text-red-500"
                              : "text-foreground/70"
                          }`}
                        >
                          {agent.contextPct}%
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="font-mono text-[10px] text-muted">
                        Model
                      </span>
                      <span className="font-mono text-[10px] text-foreground/70">
                        {agent.model?.replace("claude-", "").replace("-4-6", "") || "—"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Usage bars */}
                {u && (
                  <div className="space-y-1.5 pt-3 border-t border-border">
                    <UsageBar label="all" pct={u.allModels} />
                    <UsageBar label="sonnet" pct={u.sonnet} />
                    <UsageBar label="opus" pct={u.opus} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {usageResets && (
          <p className="font-mono text-[10px] text-muted/30 mt-2 text-right">
            usage resets {new Date(usageResets).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </p>
        )}
      </section>

      <PixelDivider />

      {/* Treasury */}
      <section className="py-8">
        <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-6">
          Treasury
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-border">
          {[
            { label: "ETH (Base)", val: treasury?.eth || "—", sub: treasury?.ethUsd },
            { label: "USDC (Base)", val: treasury?.usdcBase || "—", sub: null },
            { label: "SOL", val: treasury?.sol || "—", sub: treasury?.solUsd },
            { label: "USDC (Sol)", val: treasury?.usdcSol || "—", sub: null },
          ].map((item) => (
            <div key={item.label} className="bg-surface p-5">
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">
                {item.label}
              </p>
              <p className="font-mono text-sm text-foreground">{item.val}</p>
              {item.sub && (
                <p className="font-mono text-[10px] text-muted/50 mt-1">
                  {item.sub}
                </p>
              )}
            </div>
          ))}
        </div>
        {treasury?.total && (
          <div className="border border-border bg-surface p-5 mt-[1px]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
                Total
              </span>
              <span className="font-mono text-lg text-foreground">
                {treasury.total}
              </span>
            </div>
          </div>
        )}
      </section>

      <PixelDivider />

      {/* Active Work (Kodo) */}
      {kodo && (
        <section className="py-8">
          <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-6">
            Active Work
          </h2>
          <div className="border border-border bg-surface p-5 mb-4">
            <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2">
              Current Task
            </p>
            <p className="font-mono text-sm text-foreground">
              {kodo.activeTask || "None"}
            </p>
          </div>

          {kodo.recentOutputs && kodo.recentOutputs.length > 0 && (
            <div className="border border-border bg-surface p-5">
              <p className="font-mono text-[10px] text-muted uppercase tracking-wider mb-3">
                Recent Outputs
              </p>
              <div className="space-y-2">
                {kodo.recentOutputs.slice(0, 5).map((output, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <span className="font-mono text-[10px] text-foreground/70 truncate max-w-[300px]">
                      {output.file}
                    </span>
                    <span className="font-mono text-[10px] text-muted/50">
                      {output.lines}L
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <PixelDivider />

      {/* Needs WJP */}
      {needsWjp.length > 0 && (
        <section className="py-8">
          <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-6">
            Needs WJP
          </h2>
          <div className="space-y-[1px] bg-border">
            {needsWjp.map((item, i) => (
              <div key={i} className="bg-surface p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 border ${
                      item.priority === "blocking"
                        ? "border-red-500/50 text-red-500"
                        : item.priority === "enabling"
                          ? "border-accent/50 text-accent"
                          : "border-border text-muted"
                    }`}
                  >
                    {item.priority}
                  </span>
                  <span className="font-mono text-sm text-foreground">
                    {item.title}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted/60 ml-0">
                  {item.ask}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <PixelDivider />

      {/* Cron Health */}
      {kodo?.cronJobs && kodo.cronJobs.length > 0 && (
        <section className="py-8">
          <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-6">
            Cron Jobs
          </h2>
          <div className="border border-border bg-surface p-5">
            <div className="space-y-2">
              {kodo.cronJobs.map((job, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-foreground/70">
                    {job.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-muted/50">
                      {job.schedule}
                    </span>
                    <span
                      className={`inline-block w-1.5 h-1.5 ${
                        job.status === "active" ? "bg-accent" : "bg-foreground/10"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <PixelDivider />

      <footer className="py-16">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-muted tracking-widest">
            wjp.studio
          </p>
          <p className="font-mono text-xs text-muted">2026</p>
        </div>
      </footer>
    </div>
  );
}

// ── Page Export ───────────────────────────────────────────
export default function DashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith("dashboard_auth="));
    if (token) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-mono text-xs text-muted">···</p>
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onAuth={() => setAuthenticated(true)} />;
  }

  return <Dashboard />;
}
