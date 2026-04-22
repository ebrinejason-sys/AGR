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
                <div
                    className={styles.overlay}
                    style={{ background: 'linear-gradient(180deg, rgba(40,16,40,0.68) 0%, rgba(40,16,40,0.82) 100%)' }}
                />
            )}
            <div className={styles.content}>
                {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
                <h1 className={styles.title} style={{ textShadow: '0 2px 16px rgba(0,0,0,0.38), 0 1px 2px rgba(0,0,0,0.18)' }}>{title}</h1>
                {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
                {description && <div className={styles.description}>{description}</div>}
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
        </section>
    );
}
