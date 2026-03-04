"use client";

import { useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const [mounted, setMounted] = useState(false);

    // Only render NextThemesProvider after hydration to prevent mismatches
    useEffect(() => {
        setMounted(true);
    }, []);

    // Return plain children during SSR/hydration, then wrap after mount
    if (!mounted) {
        return <>{children}</>;
    }

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
