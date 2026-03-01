import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </head>
      <body>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
          <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 5%',
            background: 'rgba(12, 12, 12, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Image src="/logo.png" alt="African Girl Rise Logo" width={40} height={40} style={{ borderRadius: '50%' }} />
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '1px' }}>AFRICAN GIRL RISE</span>
            </Link>
            <nav style={{ display: 'flex', gap: '1.5rem', fontWeight: 500, fontSize: '0.9rem' }}>
              <Link href="/our-story" style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}>Our Story</Link>
              <Link href="/events" style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}>Events</Link>
              <Link href="/contact" style={{ color: 'var(--text-color)', transition: 'color 0.3s' }}>Contact</Link>
            </nav>
          </header>

          <main style={{ flex: 1 }}>
            {children}
          </main>

          <footer style={{
            padding: '3rem 5%',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            marginTop: 'auto',
            background: '#050505',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-muted)'
          }}>
            <p>African Girl Rise Initiative © {new Date().getFullYear()}</p>
            <p style={{ marginTop: '0.5rem' }}>Ibanda District, Western Uganda</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
