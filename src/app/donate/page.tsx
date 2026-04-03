"use client";

import { useState } from "react";
import Link from "next/link";
import DonationModal from "@/components/DonationModal";
import styles from "./page.module.css";

export default function DonatePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <h1 className="heading-xl">Support <span className="text-gradient">African Girl Rise</span></h1>
      <p className={styles.subtitle}>Use the secure donation modal to contribute by Uganda Mobile Money, or by international card checkout via Stripe.</p>

      <div className={styles.actions}>
        <button className={styles.primaryBtn} onClick={() => setIsOpen(true)}>
          Open Donation Modal
        </button>
        <Link href="/events" className={styles.secondaryBtn}>View Events</Link>
      </div>

      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}