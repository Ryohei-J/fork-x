import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/[.08] py-6 text-center text-xs text-zinc-500 dark:border-white/[.145] dark:text-zinc-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 sm:px-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/disclaimer" className="hover:text-accent-600 dark:hover:text-accent-400">
            免責事項
          </Link>
          <a
            href="https://github.com/Ryohei-J/fork-x"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-600 dark:hover:text-accent-400"
          >
            GitHub
          </a>
        </nav>
        <p>正社員 vs フリーランス 手取り比較シミュレーター</p>
      </div>
    </footer>
  );
}
