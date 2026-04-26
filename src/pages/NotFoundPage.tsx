import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
    return (
        <section className={styles.page}>
            <div className={styles.card}>
                <span className={styles.code}>404</span>
                <h1 className={styles.title}>Page Not Found</h1>
                <p className={styles.description}>The page you&apos;re looking for doesn&apos;t exist.</p>
                <Link to="/" className="btn-primary">Go Home</Link>
            </div>
        </section>
    );
}
