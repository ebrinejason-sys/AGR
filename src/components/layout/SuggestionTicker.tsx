"use client";

import { usePathname } from 'next/navigation';
import styles from './SuggestionTicker.module.css';

const PAGE_KEYWORDS: Record<string, string[]> = {
    '/': [
        "School Support", "Mentorship", "Safe Spaces", "Legal Advocacy", "Menstrual Health",
        "Emergency Support", "Community Outreach", "Girls' Rights", "Case Follow-Up", "Parent Engagement"
    ],
    '/programs': [
        "Rise Rooms", "Mental Health", "Tutoring", "STEM Workshops", "Financial Literacy",
        "Leadership", "SRHR Education", "Nutrition", "Career Exposure", "Mentorship"
    ],
    '/legal-advocacy': [
        "Rights Education", "Legal Aid", "Case Management", "Community Advocacy", "Child Protection",
        "GBV Prevention", "Justice for Girls", "Systemic Change", "Legal Awareness"
    ],
    '/our-story': [
        "Lived Experience", "Empowerment", "Healing", "Resilience", "Sustainability",
        "Community Led", "Impact", "Vision", "Values", "Our Journey"
    ],
    '/programs/rise-brothers': [
        "Allyship", "Mental Health", "Gender Equality", "Consent", "Emotional Literacy",
        "Breaking Cycles", "Joint Pad-Making", "Peer Advocacy", "Life Skills"
    ],
    '/contact': [
        "Volunteer", "Partner", "Donate", "Advocate", "Mentor", "Join the Movement"
    ]
};

export default function SuggestionTicker() {
    const pathname = usePathname();

    // Default keywords if path not explicitly mapped
    const items = PAGE_KEYWORDS[pathname] || PAGE_KEYWORDS['/'];

    return (
        <div className={styles.ticker} aria-hidden="true">
            <div className={styles.tickerTrack}>
                {[...items, ...items, ...items].map((item, i) => (
                    <span key={i} className={styles.tickerItem}>{item}</span>
                ))}
            </div>
        </div>
    );
}
