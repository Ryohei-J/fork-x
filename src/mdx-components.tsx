import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1
        className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100"
        {...props}
      />
    ),
    h2: (props) => (
      <h2
        className="mt-4 text-base font-bold text-zinc-800 dark:text-zinc-200"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="mt-2 text-sm font-bold text-zinc-800 dark:text-zinc-200"
        {...props}
      />
    ),
    p: (props) => (
      <p
        className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        {...props}
      />
    ),
    strong: (props) => (
      <strong className="font-bold text-zinc-800 dark:text-zinc-200" {...props} />
    ),
    hr: () => <hr className="border-black/[.08] dark:border-white/[.145]" />,
    a: ({ href, ...props }) => {
      const className =
        "text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300";
      if (href?.startsWith("/")) {
        return <Link href={href} className={className} {...props} />;
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          {...props}
        />
      );
    },
    ...components,
  };
}
