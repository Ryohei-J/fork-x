import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "免責事項",
  description: "正社員 vs フリーランス 手取り比較シミュレーターの免責事項",
};

const CARD_CLASS_NAME =
  "rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950";

export default function DisclaimerPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-900">
      <Header />
      <div className="flex w-full flex-1 justify-center px-4 py-8 sm:px-8">
        <div className={`flex w-full max-w-3xl flex-col gap-6 ${CARD_CLASS_NAME} p-6 sm:p-8`}>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            免責事項
          </h1>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">概算値について</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスの計算結果は、日本の税制・社会保険制度をもとにした簡略化ロジックによる概算値であり、
              実際の手取り額を保証するものではありません。扶養控除・保険料率の一部簡略化など、
              具体的な前提条件はページ内の「この試算の前提条件」および
              {" "}
              <a
                href="https://github.com/Ryohei-J/fork-x/blob/main/TODO.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                TODO.md
              </a>
              をご参照ください。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">専門的な助言ではありません</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスは税務・法律・社会保険に関する専門的な助言を目的としたものではありません。
              就業形態の変更など実際の意思決定にあたっては、税理士・社会保険労務士など専門家にご相談ください。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">データの取り扱い</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              入力された内容はサーバーに送信されず、お使いのブラウザのlocalStorageにのみ保存されます。
              本サービス側で入力内容を収集・保存することはありません。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">免責</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスの利用によって生じたいかなる損害についても、運営者は責任を負いかねます。
              あらかじめご了承ください。
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
