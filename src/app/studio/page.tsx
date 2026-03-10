import { agents } from "@/lib/data";
import { PixelDivider } from "@/components/PixelDivider";

export const metadata = {
  title: "Studio — WJP Studio",
  description: "The team. One operator, four agents.",
};

export default function StudioPage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-32 pb-16">
        <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase mb-8">
          Studio
        </p>
        <h1 className="text-3xl font-light tracking-tight mb-4 text-foreground">
          The team
        </h1>
        <p className="font-mono text-sm text-muted max-w-lg leading-relaxed">
          WJP is the principal. Four AI agents operate autonomously across
          building, growth, quality, and coordination.
        </p>
      </section>

      <PixelDivider accent />

      {/* Authority Chain — monospace art */}
      <section className="py-16">
        <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-8">
          Authority Chain
        </h2>
        <div className="border border-border bg-surface p-8 font-mono text-sm">
          <pre className="text-foreground leading-loose">
{`  WJP
   │
   ▼
  Kikai ─── operator
   │
   ├──▶ Yama ──── grower
   ├──▶ Kodo ──── builder
   └──▶ Claud ─── builder`}
          </pre>
        </div>
      </section>

      <PixelDivider />

      {/* Agents */}
      <section className="py-16">
        <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-8">
          Agents
        </h2>
        <div className="space-y-0">
          {agents.map((agent, i) => (
            <div key={agent.handle}>
              <div className="py-8">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-border bg-surface flex items-center justify-center">
                      <span className="font-mono text-lg text-muted/40">
                        {agent.name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-mono text-lg text-foreground">
                          {agent.name}
                        </h3>
                        {agent.pronouns && (
                          <span className="font-mono text-xs text-muted/40">
                            {agent.pronouns}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-muted tracking-wide uppercase mt-0.5">
                        {agent.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-muted/60 tracking-wider uppercase">
                      {agent.machine}
                    </span>
                    <span className="font-mono text-[10px] text-muted/40 px-2 py-0.5 border border-border">
                      {agent.model}
                    </span>
                  </div>
                </div>

                <div className="ml-14 mt-4">
                  <p className="text-sm text-muted leading-relaxed mb-3 max-w-xl">
                    {agent.description}
                  </p>
                  <p className="font-mono text-xs text-muted/60 mb-4">
                    Owns: {agent.owns}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {agent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="font-mono text-[10px] tracking-wider text-muted/50 px-2 py-0.5 border border-border uppercase"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {i < agents.length - 1 && <PixelDivider />}
            </div>
          ))}
        </div>
      </section>

      <PixelDivider accent />

      {/* How It Works */}
      <section className="py-16">
        <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-8">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-3 gap-[1px] bg-border">
          {[
            {
              num: "01",
              title: "Three-Gate Review",
              desc: "Every piece of work goes through agent self-review, Kikai review, then WJP approval. Content from Yama ships autonomously.",
            },
            {
              num: "02",
              title: "Model Routing",
              desc: "Haiku handles monitoring. Sonnet handles content and analysis. Opus handles strategy and complex reasoning. Never waste compute.",
            },
            {
              num: "03",
              title: "24/7 Operation",
              desc: "All agents run heartbeat crons every 20 minutes. Backup to GitHub every 2 hours. The studio never sleeps.",
            },
          ].map((item) => (
            <div key={item.num} className="bg-surface p-6">
              <p className="font-mono text-xs text-accent mb-3">{item.num}</p>
              <h3 className="font-mono text-sm text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
