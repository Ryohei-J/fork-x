import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/articles";

export const metadata: Metadata = {
  title: "お役立ち記事",
  description: "正社員とフリーランスの税金・社会保険料に関するお役立ち記事一覧",
};

const CARD_CLASS_NAME =
  "rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950";

export default function ArticlesIndexPage() {
  return (
    <>
      <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
        お役立ち記事
      </h1>
      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        正社員・フリーランスの税金や社会保険料の仕組みについて解説する記事です。計算機と合わせてご活用ください。
      </p>

      <div className="flex flex-col gap-4">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className={`flex flex-col gap-1 ${CARD_CLASS_NAME} p-5 transition hover:border-accent-300 dark:hover:border-accent-700`}
          >
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {article.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{article.description}</p>
          </Link>
        ))}
      </div>

      <Link
        href="/"
        className="text-sm font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
      >
        ← トップに戻る
      </Link>
    </>
  );
}
