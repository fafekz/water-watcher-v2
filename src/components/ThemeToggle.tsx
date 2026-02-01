import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-secondary animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Sun
        className={`w-5 h-5 transition-all ${
          isDark
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100 text-muted-foreground"
        }`}
      />
      <Moon
        className={`absolute top-2 left-2 w-5 h-5 transition-all ${
          isDark
            ? "scale-100 rotate-0 opacity-100 text-muted-foreground"
            : "scale-0 -rotate-90 opacity-0"
        }`}
      />
    </button>
  );
};
