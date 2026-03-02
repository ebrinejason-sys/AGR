import type { Metadata } from "next";
import "./globals.css";
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
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
          disableTransitionOnChange={false}
          storageKey="agr-theme"
        >
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main style={{ flex: 1 }}>
              {children}
            </main>

            <footer style={{
              padding: '3rem 5%',
              borderTop: '1px solid var(--border-color, rgba(255,255,255,0.1))',
              marginTop: 'auto',
              background: 'var(--footer-bg-color, #050505)',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-muted)'
            }}>
              <p>African Girl Rise Initiative © {new Date().getFullYear()}</p>
              <p style={{ marginTop: '0.5rem' }}>Ibanda District, Western Uganda</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
