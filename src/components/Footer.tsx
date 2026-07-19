import Image from "next/image";
import Link from "next/link";

const CONTENT_LINKS = [
  { href: "/articles", label: "お役立ち記事" },
  { href: "/glossary", label: "用語集" },
];

const SITE_LINKS = [
  { href: "/about", label: "このサイトについて" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/disclaimer", label: "免責事項" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[.08] bg-zinc-50/60 text-zinc-500 dark:border-white/[.145] dark:bg-zinc-900/40 dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8 sm:flex-row sm:justify-between">
        <div className="flex max-w-xs flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={28} height={28} className="rounded" />
            <span className="text-sm font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              正社員 <span className="text-accent-600 dark:text-accent-400">vs</span> フリーランス
            </span>
          </Link>
          <p className="text-xs leading-relaxed">
            年収・月報酬から正社員とフリーランスの手取りを概算で比較するシミュレーターです。
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-12 gap-y-6 text-center sm:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">コンテンツ</p>
            <ul className="flex flex-col gap-2 text-xs">
              {CONTENT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-600 dark:hover:text-accent-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">サイト情報</p>
            <ul className="flex flex-col gap-2 text-xs">
              {SITE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-accent-600 dark:hover:text-accent-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-black/[.08] dark:border-white/[.145]">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs sm:px-8">
          &copy; {year} 正社員 vs フリーランス 手取り比較シミュレーター
        </p>
      </div>
    </footer>
  );
}
