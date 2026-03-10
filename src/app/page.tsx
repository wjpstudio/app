import { projects } from "@/lib/data";
import { ProjectCard } from "@/components/ProjectCard";
import { AgentRow } from "@/components/AgentRow";
import { PixelDivider } from "@/components/PixelDivider";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero — type and grid, nothing else */}
      <section className="pt-32 pb-24">
        <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase mb-8">
          WJP Studio
        </p>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight leading-[1.1] mb-8 text-foreground max-w-2xl">
          A creative studio that automates everything.
        </h1>
        <p className="font-mono text-sm text-muted max-w-md leading-relaxed">
          One person. Four agents. Building products, content, and code for the
          AI economy — around the clock.
        </p>
      </section>

      <PixelDivider accent />

      {/* Active Projects — 6 cards in grid */}
      <section className="py-16">
        <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-8">
          Projects
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-border">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <PixelDivider />

      {/* Studio Team Row */}
      <section className="py-16">
        <h2 className="font-mono text-xs tracking-[0.25em] text-muted uppercase mb-8">
          The Studio
        </h2>
        <div className="border border-border bg-surface p-6">
          <AgentRow name="Kikai" role="Operator" />
          <AgentRow name="Yama" role="Grower" />
          <AgentRow name="Kodo" role="Builder" />
          <AgentRow name="Claud" role="Builder" />
        </div>
      </section>

      <PixelDivider />

      {/* Footer */}
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
