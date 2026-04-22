
import PageHero from '../components/PageHero';
const DonationModal = lazy(() => import('@/components/DonationModal'));

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.container}>
            <PageHero
                eyebrow={<span className="subheading">Support Our Mission</span>}
                title={<>Make an <span className="text-gradient">Impact</span></>}
                subtitle="Your contribution funds school retention, safe spaces, and legal advocacy for adolescent girls across Uganda. We accept Mobile Money and International Card payments."
                actions={
                    <div className={styles.actions}>
                        <button className="btn-premium" onClick={() => setIsOpen(true)}>
                            Donate Now <Heart size={18} style={{ marginLeft: 8 }} />
                        </button>
                        <Link to="/events" className="btn-secondary">
                            <Calendar size={18} style={{ marginRight: 8 }} /> See Events
                        </Link>
                    </div>
                }
            />
            <Suspense fallback={null}>
                <DonationModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            </Suspense>
        </div>
    );
}
