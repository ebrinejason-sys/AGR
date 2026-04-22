import { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar } from 'lucide-react';
import styles from './DonatePage.module.css';

const DonationModal = lazy(() => import('@/components/DonationModal'));

export default function DonatePage() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <span className="subheading">Support Our Mission</span>
                <h1 className="heading-display">Make an <span className="text-gradient">Impact</span></h1>
                <p className={styles.subtitle}>
                    Your contribution funds school retention, safe spaces, and legal advocacy for adolescent girls across Uganda. We accept Mobile Money and International Card payments.
                </p>
                
                <div className={styles.actions}>
                    <button className="btn-premium" onClick={() => setIsOpen(true)}>
                        Donate Now <Heart size={18} style={{ marginLeft: 8 }} />
                    </button>
                    <Link to="/events" className="btn-secondary">
                        <Calendar size={18} style={{ marginRight: 8 }} /> See Events
                    </Link>
                </div>
            </section>

            <Suspense fallback={null}>
                <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </Suspense>
        </div>
    );
}
