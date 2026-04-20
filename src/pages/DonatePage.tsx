import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DonatePage.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

export default function DonatePage() {
    const [isOpen, setIsOpen] = useState(false);

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
                    <Link to="/events" className={styles.secondaryBtn}>
                        <span>See upcoming events</span>
                    </Link>
                </div>
            </div>
            <Suspense fallback={null}>
                <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </Suspense>
        </div>
    );
}
