import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PixelDivider } from "@/components/PixelDivider";

interface Props {
  params: { slug: string };
}

function getContent(slug: string): { title: string; date: string; body: string } | null {
  const filePath = path.join(process.cwd(), "content", "brain-dumps", `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");
  const title = lines[0]?.replace(/^#+\s*/, "") || slug;
  const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : "Unknown";
  const body = lines.slice(1).join("\n").trim();

  return { title, date, body };
}

export function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "brain-dumps");

  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(".md", "") }));
}

export function generateMetadata({ params }: Props) {
  const content = getContent(params.slug);
  return {
    title: content ? `${content.title} — WJP Studio` : "Not Found",
  };
}

export default function BrainDumpPage({ params }: Props) {
  const content = getContent(params.slug);

  if (!content) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6">
      <section className="pt-32 pb-8">
        <Link
          href="/brain-dumps"
          className="font-mono text-xs text-muted hover:text-accent transition-colors mb-8 inline-block"
        >
          ← Back
        </Link>
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-2xl font-light tracking-tight text-foreground">
            {content.title}
          </h1>
          <span className="font-mono text-xs text-muted/40 shrink-0 ml-4">
            {content.date}
          </span>
        </div>
      </section>

      <PixelDivider accent />

      <article className="py-8 prose-custom">
        {content.body.split("\n\n").map((paragraph, i) => {
          if (paragraph.startsWith("## ")) {
            return (
              <h2
                key={i}
                className="font-mono text-sm text-foreground tracking-wide uppercase mt-12 mb-4"
              >
                {paragraph.replace("## ", "")}
              </h2>
            );
          }
          if (paragraph.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="font-mono text-xs text-muted tracking-wide uppercase mt-8 mb-3"
              >
                {paragraph.replace("### ", "")}
              </h3>
            );
          }
          if (paragraph.startsWith("- ")) {
            return (
              <ul key={i} className="mb-6 space-y-1">
                {paragraph.split("\n").map((line, j) => (
                  <li
                    key={j}
                    className="text-sm text-muted leading-relaxed pl-4 before:content-['·'] before:absolute before:left-0 relative"
                  >
                    {line.replace(/^- /, "")}
                  </li>
                ))}
              </ul>
            );
          }
          if (paragraph.startsWith("---")) {
            return <PixelDivider key={i} />;
          }
          return (
            <p key={i} className="text-sm text-muted leading-relaxed mb-6">
              {paragraph}
            </p>
          );
        })}
      </article>

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
