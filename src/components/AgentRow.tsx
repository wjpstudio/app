interface AgentRowProps {
  name: string;
  role: string;
}

export function AgentRow({ name, role }: AgentRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="font-mono text-sm text-foreground">{name}</span>
      <span className="font-mono text-xs text-muted tracking-wide uppercase">
        {role}
      </span>
    </div>
  );
}
