import { ProjectStatus } from "@/lib/data";

const labels: Record<ProjectStatus, string> = {
  live: "LIVE",
  launching: "LAUNCHING",
  building: "BUILDING",
  planning: "RESEARCH",
  paused: "PAUSED",
};

const colors: Record<ProjectStatus, string> = {
  live: "border-accent text-accent",
  launching: "border-foreground/40 text-foreground/60",
  building: "border-foreground/20 text-foreground/40",
  planning: "border-foreground/10 text-foreground/30",
  paused: "border-foreground/10 text-foreground/20",
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-block font-mono text-[10px] tracking-widest px-2 py-0.5 border ${colors[status]}`}
    >
      {labels[status]}
    </span>
  );
}
