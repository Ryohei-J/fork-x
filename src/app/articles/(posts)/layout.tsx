import Link from "next/link";

const CARD_CLASS_NAME =
  "rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950";

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <article className={`flex w-full flex-col gap-4 ${CARD_CLASS_NAME} p-6 sm:p-8`}>
      {children}
      <Link
        href="/articles"
        className="text-sm font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
      >
        ← 記事一覧に戻る
      </Link>
    </article>
  );
}
