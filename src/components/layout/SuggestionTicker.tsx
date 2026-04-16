"use client";

import { usePathname } from 'next/navigation';
import styles from './SuggestionTicker.module.css';

const PAGE_KEYWORDS: Record<string, string[]> = {
    '/': [
        "School Support", "Mentorship", "Safe Spaces", "Legal Advocacy", "Menstrual Health",
        "Emergency Support", "Community Outreach", "Girls' Rights", "Case Follow-Up", "Parent Engagement",
        "Rise Brothers", "Building Allies", "Ending Period Poverty", "Trauma Recovery"
    ],
    '/programs': [
        "Rise Rooms", "Mental Health", "Tutoring", "STEM Workshops", "Financial Literacy",
        "Leadership", "SRHR Education", "Nutrition", "Career Exposure", "Mentorship",
        "Rise Brothers", "Allyship", "Practical Life Skills", "Peer Advocacy"
    ],
    '/legal-advocacy': [
        "Rights Education", "Legal Aid", "Case Management", "Community Advocacy", "Child Protection",
        "GBV Prevention", "Justice for Girls", "Systemic Change", "Legal Awareness", "Reporting Abuse"
    ],
    '/our-story': [
        "Lived Experience", "Empowerment", "Healing", "Resilience", "Sustainability",
        "Community Led", "Impact", "Vision", "Values", "Our Journey", "Founding Story"
    ],
    '/programs/rise-brothers': [
        "Allyship", "Mental Health", "Gender Equality", "Consent", "Emotional Literacy",
        "Breaking Cycles", "Joint Pad-Making", "Peer Advocacy", "Life Skills", "Toxic Masculinity"
    ],
    '/programs/healing-the-ground': [
        "Trauma Recovery", "Rise Rooms", "Sanctuaries", "Safe Spaces", "Counseling",
        "Mental Health", "Resilience", "Healing", "Sisterhood", "Emotional Support"
    ],
    '/programs/building-the-ladder': [
        "Education Drive", "Scholastic Support", "Pad Making", "Skill Building", "Vocational Training",
        "Soap Making", "Tailoring", "Financial Literacy", "Self-Sufficiency", "Livelihoods"
    ],
    '/programs/reaching-new-altitudes': [
        "Leadership", "Career Exposure", "Mentorship", "Legacy", "Alumni Network",
        "Public Speaking", "Community Projects", "Future Pathways", "Champions", "Vision"
    ],
    '/contact': [
        "Volunteer", "Partner", "Donate", "Advocate", "Mentor", "Join the Movement", "Contact Us"
    ],
    '/founder': [
        "Akatwijuka Grace", "Founder's Story", "Leadership", "Lived Experience", "Advocacy", "Visionary"
    ]
};

export default function SuggestionTicker() {
    const pathname = usePathname();

    // Default keywords if path not explicitly mapped
    const items = PAGE_KEYWORDS[pathname] || PAGE_KEYWORDS['/'];
    const tickerItems = [...items, ...items];

    return (
        <div className={styles.ticker} aria-hidden="true">
            <div className={styles.tickerTrack}>
                {tickerItems.map((item, index) => (
                    <span key={`${item}-${index}`} className={styles.tickerItem}>{item}</span>
                ))}
            </div>
        </div>
    );
}
