import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
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
  appleWebApp: {
    title: "African Girl Rise",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    apple: "/logo.png",
  },
  // Disable iOS auto-detection to prevent hydration errors from injected <a> tags
  other: {
    "format-detection": "telephone=no, date=no, address=no, email=no",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ua = (await headers()).get("user-agent") || "";
  const isIOSDevice = /iPad|iPhone|iPod|CriOS|FxiOS/i.test(ua);

  return (
    <html
      lang="en"
      className={`antialiased ${inter.variable} ${playfair.variable}`}
      data-ios={isIOSDevice ? "1" : undefined}
      data-runtime-safe={isIOSDevice ? "1" : undefined}
      suppressHydrationWarning
    >
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
            <Preloader skip={isIOSDevice} />
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
