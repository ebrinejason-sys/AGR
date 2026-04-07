"use client";

import { useState } from "react";
import Link from "next/link";
import DonationModal from "@/components/DonationModal";
import styles from "./page.module.css";

export default function DonatePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container} style={{ padding: '15rem 5%', textAlign: 'center', background: 'white' }}>
      <p className="subheading reveal">Philanthropy</p>
      <h1 className="heading-display reveal">Support <span className="text-gradient">Her Rise</span></h1>
      <p style={{ maxWidth: '800px', margin: '2rem auto 5rem', fontSize: '1.2rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
        Utilize our secure gateway to invest in transformative programs. Your partnership
        dismantles barriers and architects legacies of resilience across Uganda.
      </p>

      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn-premium" onClick={() => setIsOpen(true)}>
          <span>Secure Contribution</span>
        </button>
        <Link href="/events" className="btn-premium" style={{ background: 'white', color: 'black', border: '1px solid var(--border-color)' }}>
          <span>View Impact Events</span>
        </Link>
      </div>

      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
