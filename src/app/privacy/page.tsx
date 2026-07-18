import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "正社員 vs フリーランス 手取り比較シミュレーターのプライバシーポリシー",
};

const CARD_CLASS_NAME =
  "rounded-2xl border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-950";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-zinc-900">
      <Header />
      <div className="flex w-full flex-1 justify-center px-4 py-8 sm:px-8">
        <div className={`flex w-full max-w-3xl flex-col gap-6 ${CARD_CLASS_NAME} p-6 sm:p-8`}>
          <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            プライバシーポリシー
          </h1>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">入力データの取り扱い</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスの計算機能に入力した年収・扶養人数などの内容は、お使いのブラウザの
              localStorageにのみ保存され、運営者を含む第三者のサーバーに送信・収集されることはありません。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">アクセス解析について</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスはGoogle Analyticsを使用し、アクセス状況の把握のためにCookieを利用しています。
              Google Analyticsによって収集される情報の取り扱いについては、
              {" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                Googleのプライバシーポリシー
              </a>
              をご確認ください。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">広告配信について</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本サービスは、第三者配信の広告サービス（Google
              AdSenseなど）を利用する場合があります。広告配信事業者は、ユーザーの興味に応じた広告を表示するために
              Cookieを使用することがあります。Cookieを利用することで、当サービスや他サイトへのアクセス情報に基づいて
              広告が配信されますが、これには氏名・住所・メールアドレス・電話番号は含まれません。
            </p>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Googleの広告Cookieの使用によりGoogleやそのパートナーが、当サイトや他のサイトへの過去のアクセス情報に基づいて
              広告を配信します。Googleの広告設定を無効にする場合は、
              {" "}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-600 underline hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
              >
                Googleの広告設定ページ
              </a>
              をご利用ください。
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">お問い合わせ</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本ポリシーに関するお問い合わせは
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

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">改定について</h2>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              本ポリシーの内容は、法令の変更やサービス内容の変更に伴い、予告なく変更することがあります。
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
