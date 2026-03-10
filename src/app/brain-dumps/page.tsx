import fs from "fs";
import path from "path";
import Link from "next/link";
import { PixelDivider } from "@/components/PixelDivider";

export const metadata = {
  title: "Brain Dumps — WJP Studio",
  description: "Shared context docs from the studio. Most recent first.",
};

interface BrainDump {
  slug: string;
  title: string;
  date: string;
  preview: string;
}

function getBrainDumps(): BrainDump[] {
  const dir = path.join(process.cwd(), "content", "brain-dumps");

  if (!fs.existsSync(dir)) {
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const content = fs.readFileSync(path.join(dir, file), "utf-8");
      const lines = content.split("\n").filter(Boolean);
      const title = lines[0]?.replace(/^#+\s*/, "") || file.replace(".md", "");
      const dateMatch = file.match(/(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1] : "Unknown";
      const preview =
        lines
          .slice(1)
          .find((l) => !l.startsWith("#") && !l.startsWith("---") && l.trim())
          ?.slice(0, 200) || "";

      return {
        slug: file.replace(".md", ""),
        title,
        date,
        preview,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export default function BrainDumpsPage() {
  const dumps = getBrainDumps();

  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-32 pb-16">
        <p className="font-mono text-xs tracking-[0.25em] text-accent uppercase mb-8">
          Brain Dumps
        </p>
        <h1 className="text-3xl font-light tracking-tight mb-4 text-foreground">
          Studio context
        </h1>
        <p className="font-mono text-sm text-muted max-w-lg leading-relaxed">
          What we learned, what we decided, what changed. Drop a .md file in
          /content/brain-dumps/ to add one.
        </p>
      </section>

      <PixelDivider accent />

      <section className="py-16">
        {dumps.length === 0 ? (
          <div className="py-16 text-center border border-border bg-surface">
            <p className="font-mono text-sm text-muted">
              No brain dumps yet.
            </p>
            <p className="font-mono text-xs text-muted/50 mt-2">
              Add .md files to /content/brain-dumps/
            </p>
          </div>
        ) : (
          <div className="space-y-0">
            {dumps.map((dump, i) => (
              <div key={dump.slug}>
                <Link
                  href={`/brain-dumps/${dump.slug}`}
                  className="block py-8 group"
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h2 className="font-mono text-sm text-foreground group-hover:text-accent transition-colors">
                      {dump.title}
                    </h2>
                    <span className="font-mono text-xs text-muted/40 shrink-0 ml-4">
                      {dump.date}
                    </span>
                  </div>
                  {dump.preview && (
                    <p className="text-sm text-muted/60 max-w-xl line-clamp-2">
                      {dump.preview}
                    </p>
                  )}
                </Link>
                {i < dumps.length - 1 && <PixelDivider />}
              </div>
            ))}
          </div>
        )}
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
