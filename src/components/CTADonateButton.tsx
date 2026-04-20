import { useState } from "react";
import DonationModal from "@/components/DonationModal";
import styles from '../pages/HomePage.module.css';

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
