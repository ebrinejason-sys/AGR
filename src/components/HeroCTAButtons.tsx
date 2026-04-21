import { useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
const DonationModal = lazy(() => import("@/components/DonationModal"));
import styles from '../pages/HomePage.module.css';

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
        <Link to="/programs" className={styles.btnGhost}>
          Explore Programs
        </Link>
      </div>

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
