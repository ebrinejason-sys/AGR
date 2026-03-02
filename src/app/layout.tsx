import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "African Girl Rise",
  description: "Breaking cycles. One girl at a time. One generation at a time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* iOS PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="African Girl Rise" />

        {/* Theme Color - Light theme color for better iOS compatibility */}
        <meta name="theme-color" content="#e91e8c" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          themes={["light", "dark"]}
          enableSystem
          disableTransitionOnChange={true}
          storageKey="agr-theme"
        >
          <div className={styles.layoutContainer}>
            <Navbar />

            <main className={styles.mainContent}>
              {children}
            </main>

            <footer className={styles.footer}>
              <p>African Girl Rise Initiative © {new Date().getFullYear()}</p>
              <p className={styles.footerLocation}>Ibanda District, Western Uganda</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
