export type Theme = "light" | "dark" | "system";

const THEME_KEY = "levelup-theme";

const getSystemDark = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === "light" || stored === "dark" || stored === "system"
    ? stored
    : "system";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  const isDark = theme === "dark" || (theme === "system" && getSystemDark());
  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

export function initTheme(): void {
  applyTheme(getStoredTheme());
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => applyTheme(getStoredTheme()));
}
