import type { MDXComponents } from "mdx/types";
import Link from "next/link";

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "tip" | "reference";
  children: React.ReactNode;
}) {
  const config = {
    info: {
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
      className: "border-border bg-muted/30",
    },
    warning: {
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
      className: "border-border bg-muted/30",
    },
    tip: {
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      ),
      className: "border-border bg-muted/30",
    },
    reference: {
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      className: "border-border bg-muted/30",
    },
  };

  const { icon, className } = config[type];

  return (
    <div
      className={`my-6 rounded-lg border px-4 py-3 ${className}`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-muted-foreground">{icon}</span>
        <div className="text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ children, filename }: { children: React.ReactNode; filename?: string }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border bg-muted/30">
      {filename && (
        <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
          </svg>
          {filename}
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1
      className="mt-8 mb-6 font-serif text-4xl font-bold tracking-tight text-foreground"
      style={{ textWrap: "balance" }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      className="mt-12 mb-4 font-serif text-2xl font-semibold tracking-tight text-foreground"
      style={{ textWrap: "balance" }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      className="mt-8 mb-3 font-serif text-lg font-semibold text-foreground"
      style={{ textWrap: "balance" }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 mb-2 font-serif text-base font-medium text-foreground">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-7 text-muted-foreground [&:not(:first-child)]:mt-4">
      {children}
    </p>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href || "#"}
        className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children }) => (
    <ul className="mb-4 ml-6 list-disc space-y-2 text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2 text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-foreground/20 pl-4 text-muted-foreground italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">
          {children}
        </code>
      );
    }
    return (
      <code className={`${className} text-sm font-mono`}>{children}</code>
    );
  },
  pre: ({ children }) => (
    <div className="my-6 overflow-hidden rounded-lg border bg-muted/30">
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        {children}
      </pre>
    </div>
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-hidden rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b bg-muted/50">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children, ...props }) => (
    <tr className="border-b last:border-0 transition-colors hover:bg-muted/30" {...props}>
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left font-medium text-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-muted-foreground">{children}</td>
  ),
  hr: () => <hr className="my-10 border-border" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  Callout,
  CodeBlock,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
