"use client";

import { THEME_STORAGE_KEY } from "@/lib/theme";

function toggleTheme() {
  const root = document.documentElement;
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // localStorage が使えない環境ではテーマの永続化のみ諦める
  }
}

/**
 * アイコンの出し分けは data-theme 属性を見た CSS（dark: バリアント）だけで行い、
 * React state は持たない。SSR/クライアントで値が食い違うハイドレーション問題を避けるため。
 */
export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="ライトモードとダークモードを切り替え"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] text-zinc-600 outline-none transition-colors hover:border-accent-300 hover:text-accent-600 focus-visible:ring-2 focus-visible:ring-accent-500/40 dark:border-white/[.145] dark:text-zinc-400 dark:hover:border-accent-700 dark:hover:text-accent-400"
    >
      <svg
        className="block h-5 w-5 dark:hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg
        className="hidden h-5 w-5 dark:block"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}
