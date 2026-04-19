"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const DonationModal = dynamic(() => import("@/components/DonationModal"), {
  ssr: false,
});

/**
 * Thin client wrapper that owns the donation modal open/close state for the
 * hero section. Renders the full heroCtas row (pink button + ghost link) so
 * the visual layout is identical to the original, while keeping page.tsx as a
 * Server Component. This prevents a full-page JS boot failure from crashing
 * the tab on iOS Safari.
 */
export default function HeroCTAButtons() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <>
      <div className={styles.heroCtas}>
        <button
          onClick={() => setIsDonationModalOpen(true)}
          className={styles.btnPink}
        >
          Support Her Rise
        </button>
        <Link href="/programs" className={styles.btnGhost}>
          Explore Programs
        </Link>
      </div>

      {isDonationModalOpen ? (
        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
        />
      ) : null}
    </>
  );
}
