import { useState, lazy, Suspense } from "react";
const DonationModal = lazy(() => import("@/components/DonationModal"));
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
        <Suspense fallback={null}>
          <DonationModal
            isOpen={isDonationModalOpen}
            onClose={() => setIsDonationModalOpen(false)}
          />
        </Suspense>
      ) : null}
    </>
  );
}
