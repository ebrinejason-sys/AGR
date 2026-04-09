"use client";

import { useState } from "react";
import Link from "next/link";
import DonationModal from "@/components/DonationModal";
import styles from "./page.module.css";

export default function DonatePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <p className="subheading reveal">Philanthropy</p>
        <h1 className="heading-display reveal">Support <span className="text-gradient">Her Rise</span></h1>
        <p className={styles.subtitle}>
          Utilize our secure gateway to invest in transformative programs. Your partnership
          dismantles barriers and architects legacies of resilience across Uganda.
        </p>
        <div className={styles.actions}>
          <button className="btn-premium" onClick={() => setIsOpen(true)}>
            <span>Secure Contribution</span>
          </button>
          <Link href="/events" className={styles.secondaryBtn}>
            <span>View Impact Events</span>
          </Link>
        </div>
      </div>
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
