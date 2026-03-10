import { projects } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { PixelDivider } from "@/components/PixelDivider";

export const metadata = {
  title: "Projects — WJP Studio",
  description: "Active projects and their current status.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-32 pb-16">
        <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase mb-8">
          Projects
        </p>
        <h1 className="text-3xl font-light tracking-tight mb-4 text-foreground">
          What we&rsquo;re building
        </h1>
        <p className="font-mono text-sm text-muted max-w-lg leading-relaxed">
          Products, protocols, and experiments across crypto, commerce, and
          culture.
        </p>
      </section>

      <PixelDivider accent />

      <section className="py-16">
        <div className="space-y-0">
          {projects.map((project, i) => (
            <div key={project.slug}>
              <div className="py-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-muted/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-mono text-lg tracking-wide text-foreground">
                      {project.name}
                    </h2>
                    <StatusBadge status={project.status} />
                  </div>
                </div>

                <div className="ml-10">
                  <p className="text-sm text-muted leading-relaxed mb-4 max-w-xl">
                    {project.description}
                  </p>

                  {project.stack && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] tracking-wider text-muted/60 px-2 py-0.5 border border-border uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-muted hover:text-accent transition-colors"
                      >
                        {project.url.replace("https://", "")} ↗
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-muted hover:text-foreground transition-colors"
                      >
                        github ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
              {i < projects.length - 1 && <PixelDivider />}
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
