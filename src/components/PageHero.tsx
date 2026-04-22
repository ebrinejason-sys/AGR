import { ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
    eyebrow?: string | ReactNode;
    title: string | ReactNode;
    subtitle?: string;
    description?: string | ReactNode;
    actions?: ReactNode;
    backgroundImage?: string;
    darkOverlay?: boolean;
}

export default function PageHero({
    eyebrow,
    title,
    subtitle,
    description,
    actions,
    backgroundImage,
    darkOverlay = true,
}: PageHeroProps) {
    return (
        <section
            className={styles.hero}
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
            {darkOverlay && (
                <div className={`${styles.overlay} ${styles.overlayDark}`} />
            )}
            <div className={styles.content}>
                {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
                <h1 className={`${styles.title} ${styles.titleShadow}`}>{title}</h1>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                {description && <div className={styles.description}>{description}</div>}
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
        </section>
    );
}
