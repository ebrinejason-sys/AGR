import styles from './TickerBanner.module.css';

const DEFAULT_ITEMS = [
    '🎓 Education', '🛡️ Safety', '⚖️ Legal Advocacy', '👥 Community',
    '💡 Mentorship', '🌍 Empowerment', '📚 School Retention', '❤️ Trauma Recovery',
    '🤝 Partnerships', '🏡 Safe Spaces', '✊ Rights Awareness', '🌱 Growth',
];

interface TickerBannerProps {
    items?: string[];
    /** 'default' = pink dot separator, 'teal' = teal dot, 'purple' = purple dot */
    accent?: 'default' | 'teal' | 'purple';
}

export default function TickerBanner({ items = DEFAULT_ITEMS, accent = 'default' }: TickerBannerProps) {
    const all = [...items, ...items];
    return (
        <div className={`${styles.wrap} ${styles[accent]}`}>
            <div className={styles.track}>
                {all.map((item, i) => (
                    <span key={i} className={styles.item}>
                        {item}
                        <span className={styles.dot} aria-hidden="true">·</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
