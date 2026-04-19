"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const DonationModal = dynamic(() => import("@/components/DonationModal"), {
  ssr: false,
});

/**
 * Client wrapper for the CTA band "Donate Now" button at the bottom of the
 * homepage. Kept separate from HeroCTAButtons so each can be used independently
 * without double-mounting the modal state.
 */
export default function CTADonateButton() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDonationModalOpen(true)}
        className={styles.ctaBtnWhite}
      >
        Donate Now
      </button>

      {isDonationModalOpen ? (
        <DonationModal
          isOpen={isDonationModalOpen}
          onClose={() => setIsDonationModalOpen(false)}
        />
      ) : null}
    </>
  );
}
