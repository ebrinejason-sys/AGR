import { ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
    eyebrow?: string;
    title: string | ReactNode;
    subtitle?: string;
    description?: string;
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
            {darkOverlay && <div className={styles.overlay} />}
            <div className={styles.content}>
                {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
                
                <h1 className={styles.title}>{title}</h1>
                
                {subtitle && <h2 className={styles.subtitle}>{subtitle}</h2>}
                
                {description && <p className={styles.description}>{description}</p>}
                
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
        </section>
    );
}
