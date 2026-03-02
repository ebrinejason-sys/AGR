import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "African Girl Rise",
  description: "Breaking cycles. One girl at a time. One generation at a time.",
  themeColor: "#0c0c0c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', /* fallback */ }} >
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
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
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
