import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import Preloader from "@/components/Preloader";
import RuntimeStabilityGuard from "@/components/RuntimeStabilityGuard";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

// iOS-safe viewport: prevents auto-zoom on inputs, covers notch area
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#e91e8c",
};

export const metadata: Metadata = {
  title: "African Girl Rise",
  description: "Breaking cycles. One girl at a time. One generation at a time.",
  // Disable iOS auto-detection to prevent hydration errors from injected <a> tags
  other: {
    "format-detection": "telephone=no, date=no, address=no, email=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`antialiased ${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body>
        <RuntimeStabilityGuard />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="light"
          themes={["light"]}
          enableSystem={false}
          disableTransitionOnChange={true}
          storageKey="agr-theme"
        >
          <div className={styles.layoutContainer}>
            <Preloader />
            <Navbar />

            <main className={styles.mainContent}>
              {children}
            </main>

            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
