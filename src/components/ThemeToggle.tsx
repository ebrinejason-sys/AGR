"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by waiting until component is mounted
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className={styles.toggleHolder} aria-hidden="true" />;
    }

    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={styles.toggleBtn}
            aria-label="Toggle theme"
            title="Toggle theme"
        >
            {isDark ? (
                <Sun size={20} className={styles.icon} />
            ) : (
                <Moon size={20} className={styles.icon} />
            )}
        </button>
    );
}
