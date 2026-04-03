"use client";

import { useState } from 'react';
import DonationModal from '@/components/DonationModal';
import styles from './page.module.css';

export default function PayPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Secure Payment</h1>
        <p>This is a shareable payment link. Choose your preferred payment method to continue.</p>
        <button onClick={() => setIsOpen(true)} className={styles.button}>
          Open Payment Modal
        </button>
      </div>
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
