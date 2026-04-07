"use client";

import { useState } from 'react';
import DonationModal from '@/components/DonationModal';
import styles from './page.module.css';

export default function PayPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className="serif">Secure <span className="text-gradient">Investment</span></h1>
        <p>You have accessed our secure payment gateway. Please select your contribution method below to proceed with your investment in the next generation.</p>
        <button onClick={() => setIsOpen(true)} className="btn-premium">
          <span>Continue to Secure Modal</span>
        </button>
      </div>
      <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
