import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "正社員 vs フリーランス 手取り比較シミュレーターの運営者情報・目的について",
};

const CARD_CLASS_NAME =
  "rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-900">
      <Header />
      <div className="flex w-full flex-1 justify-center px-4 py-8 sm:px-8">
        <div className={`flex w-full max-w-3xl flex-col gap-6 ${CARD_CLASS_NAME} p-6 sm:p-8`}>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            このサイトについて
          </h1>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">サイトの目的</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              「正社員 vs フリーランス
              手取り比較シミュレーター」は、Webエンジニアが正社員として働く場合とフリーランスとして働く場合の手取り額を、
              日本の税制・社会保険制度をもとにした概算ロジックで比較できるツールです。
              就業形態の変更を検討する際の目安として、無料でご利用いただけます。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">運営者</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Ryohei-J（個人開発）
            </p>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              ソースコードは
              {" "}
              <a
                href="https://github.com/Ryohei-J/fork-x"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                GitHub
              </a>
              で公開しています。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">計算結果について</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスの計算結果はあくまで概算・目安です。詳しい前提条件は
              {" "}
              <Link
                href="/disclaimer"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                免責事項
              </Link>
              をご確認ください。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">お問い合わせ</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              ご意見・ご要望は
              {" "}
              <Link
                href="/contact"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                お問い合わせページ
              </Link>
              よりご連絡ください。
            </p>
          </section>

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
