import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { setTheme, type Theme } from "@/utils/theme";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next: Theme = isDark ? "light" : "dark";
    setTheme(next);
    setIsDark(!isDark);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors duration-200 overflow-hidden"
    >
      <span className="relative block w-5 h-5">
        <Sun
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-50"
          }`}
        />
        <Moon
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-50"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
      </span>
    </button>
  );
};
