import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "正社員 vs フリーランス 手取り比較シミュレーターへのお問い合わせ",
};

const CARD_CLASS_NAME =
  "rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950";

const CONTACT_EMAIL = "ad.tgib.tsr@gmail.com";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-900">
      <Header />
      <div className="flex w-full flex-1 justify-center px-4 py-8 sm:px-8">
        <div className={`flex w-full max-w-3xl flex-col gap-6 ${CARD_CLASS_NAME} p-6 sm:p-8`}>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            お問い合わせ
          </h1>

          <section className="flex flex-col gap-2">
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスの計算内容の誤り、ご意見・ご要望、その他お問い合わせは、以下のメールアドレスまでご連絡ください。
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm font-semibold text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
            >
              {CONTACT_EMAIL}
            </a>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">バグ報告・機能要望</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              計算ロジックの不具合や機能要望は、
              {" "}
              <a
                href="https://github.com/Ryohei-J/fork-x/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                GitHub Issues
              </a>
              でも受け付けています。
            </p>
          </section>

          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
            ご連絡内容の性質上、返信までお時間をいただく場合や、返信できない場合がございます。あらかじめご了承ください。
          </p>

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
