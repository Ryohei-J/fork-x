import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-accent-100 bg-white/80 backdrop-blur dark:border-accent-900/60 dark:bg-zinc-900/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-8">
        <Link
          href="/"
          className="flex cursor-default items-center gap-2 text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-lg"
        >
          <Image src="/logo.png" alt="" width={28} height={28} className="rounded" />
          <span>
            正社員 <span className="text-accent-600 dark:text-accent-400">vs</span> フリーランス
            <span className="hidden sm:inline"> 手取り比較シミュレーター</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
