import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { GLOSSARY_TERMS } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "用語集",
  description: "正社員・フリーランスの税金や社会保険料に関する用語集",
};

const CARD_CLASS_NAME =
  "rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950";

export default function GlossaryPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-900">
      <Header />
      <div className="flex w-full flex-1 justify-center px-4 py-8 sm:px-8">
        <div className={`flex w-full max-w-3xl flex-col gap-6 ${CARD_CLASS_NAME} p-6 sm:p-8`}>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              用語集
            </h1>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              正社員・フリーランスの手取りを比較する際によく出てくる税金・社会保険料の用語をまとめました。
            </p>
          </div>

          <dl className="flex flex-col gap-5">
            {GLOSSARY_TERMS.map((item) => (
              <div key={item.term} className="flex flex-col gap-1">
                <dt className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {item.term}
                </dt>
                <dd className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-col gap-1 border-t border-black/[.08] pt-4 dark:border-white/[.145]">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              各用語の詳しい仕組みは
              {" "}
              <Link
                href="/articles"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                お役立ち記事
              </Link>
              でも解説しています。
            </p>
          </div>

          <Link
            href="/"
            className="text-sm font-semibold text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
          >
            ← トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
