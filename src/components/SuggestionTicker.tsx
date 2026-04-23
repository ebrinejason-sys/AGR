"use client";

import { useLocation } from 'react-router-dom';
import styles from './SuggestionTicker.module.css';

const SUGGESTIONS: Record<string, string[]> = {
  '/': [
    'Direct support for 56,000+ girls',
    'Practical school retention support',
    'Local responses for local challenges',
    'Stable sanctuaries for girls in crisis',
    'Healing the ground through trauma recovery',
    'Building stronger futures in Uganda'
  ],
  '/programs': [
    'Four clear pathways for girl empowerment',
    'Rise Sanctuaries: Safe spaces and counselling',
    'Academic Rescue: Keeping girls in school',
    'Legal Advocacy: Rights and protection',
    'Rise Brothers: Engaging boys as allies'
  ],
  '/stories': [
    'Voices from the community',
    'Real impact, real transformation',
    'Documentation of our journey',
    'Lived experience building better systems',
    'Moments of resilience and hope'
  ],
  '/contact': [
    'Reach out for partnerships',
    'Volunteer your time and skills',
    'Ask about our local interventions',
    'Connect with the African Girl Rise team',
    'General inquiries and support'
  ],
  '/our-story': [
    'Founded on lived experience',
    'A journey from crisis to momentum',
    'Our vision for a safe, protected girl child',
    'Rooted in Ugandan community care',
    'The values that drive our work'
  ],
  '/founder': [
    'Akatwijuka Grace: A story of resilience',
    'Leading with purpose and experience',
    'Breaking cycles so others can rise',
    'A commitment to the next generation',
    'Founder\'s vision and leadership'
  ]
};

const DEFAULT_SUGGESTIONS = [
  'African Girl Rise · Uganda',
  'Practical support for the girl child',
  'Rise. Then reach back.',
  'Funded by partners, led by locals',
  'Keeping girls safe and learning'
];

export default function SuggestionTicker() {
  const location = useLocation();
  const path = location.pathname;
  
  const suggestions = SUGGESTIONS[path] || DEFAULT_SUGGESTIONS;
  // Duplicate for seamless loop
  const displayItems = [...suggestions, ...suggestions, ...suggestions];

  return (
    <div className={styles.tickerWrapper} style={{ willChange: 'transform' }}>
      <div className={styles.tickerTrack} style={{ willChange: 'transform' }}>
        {displayItems.map((text, i) => (
          <div key={`${text}-${i}`} className={styles.tickerItem}>
            <span className={styles.tickerDot} />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
