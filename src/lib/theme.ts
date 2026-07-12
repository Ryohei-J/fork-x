export const THEME_STORAGE_KEY = "fork-x:theme";

/**
 * <head> 内で同期実行し、ペイント前に data-theme 属性を確定させるスクリプト。
 * 保存済みの選択がなければ OS のカラースキーム設定に従う。
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}";var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
