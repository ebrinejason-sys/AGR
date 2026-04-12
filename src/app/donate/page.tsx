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
        <p className="subheading reveal">Donate</p>
        <h1 className="heading-display reveal">Make a donation</h1>
        <p className={styles.subtitle}>
          Use mobile money through Flutterwave or card through MarzPay. Donations support school
          retention, safe spaces, mentorship, and legal advocacy for girls in Uganda.
        </p>
        <div className={styles.actions}>
          <button className="btn-premium" onClick={() => setIsOpen(true)}>
            <span>Open donation form</span>
          </button>
          <Link href="/events" className={styles.secondaryBtn}>
            <span>See upcoming events</span>
          </Link>
        </div>
      </div>
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
