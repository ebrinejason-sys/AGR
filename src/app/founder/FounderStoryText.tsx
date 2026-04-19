"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function FounderStoryText() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.editorialText}>
      {/* Compelling teaser — always visible */}
      <p>I grew up in Ibanda District, in the rolling hills of Western Uganda — a place of breathtaking beauty. But beauty does not fill stomachs. Beauty does not pay school fees.</p>

      <p>My family was not wealthy. But poverty was not the whole story. The whole story is this: <strong>my parents refused to let their suffering become my inheritance.</strong></p>

      {/* Highlighted moments — always visible */}
      <div className={styles.highlightBlock}>
        <div className={styles.highlightItem}>
          <span className={styles.highlightNumber}>Five</span>
          <p>I grew up alongside five girls — Annet, Grace, Mary, Robinah, Sylvia — who dreamed with me under the mango tree. Every single one of them left school before finishing. Married off, pushed aside, silenced. <strong>I kept walking. Why me? Because my parents chose differently.</strong></p>
        </div>
        <div className={styles.highlightItem}>
          <span className={styles.highlightNumber}>Law</span>
          <p>I watched my friends fall — one married off too young, another pulled out of school for her brothers to study. <em>The system did not protect them. So I decided to become someone who would.</em> A lawyer stands as a shield between the powerless and a cruel system. I chose law because justice is not given — it is fought for. And I will fight for every girl who was told her voice doesn&rsquo;t matter.</p>
        </div>
        <div className={styles.highlightItem}>
          <span className={styles.highlightNumber}>Vision</span>
          <p>I put African Girl Rise Initiative in place to break the cycle that stole my friends. To give every girl a safe place to heal, skills to stand on her own, knowledge to protect herself, and leadership to lift others. <strong>Because when one girl rises, she reaches back — and generations change.</strong></p>
        </div>
      </div>

      {!expanded && (
        <button className={styles.readMoreBtn} onClick={() => setExpanded(true)}>
          Read Full Story ↓
        </button>
      )}

      {expanded && (
        <>
          <h3 className={styles.subhead}>Growing Up in Ibanda</h3>
          <p>My mother studied by kerosene lamp when there was kerosene. She walked kilometres on empty stomachs, determined that education would be her ladder out of poverty. She completed her education and made sure my path would be easier than hers. My father had grit, prayer, and an unshakeable belief that tomorrow could be better than today — and he completed his education through sheer stubborn faith.</p>

          <h3 className={styles.subhead}>The Girls Who Walked Beside Me</h3>
          <p>We sat together on broken desks, sharing textbooks with missing pages. We walked the same dusty roads, our bare feet slapping against the red earth. We promised each other we would all make it. But life had different plans.</p>

          <p>Annet was married at fifteen. Grace dropped out when her father died and relatives did not believe in girl education. Mary stayed home so her brother could continue secondary school. Robinah became pregnant — the teacher who promised to marry her disappeared; the school expelled her. Sylvia was married at seventeen to a man old enough to be her grandfather.</p>

          <p><strong>And I kept walking.</strong> Why me? Because my parents chose differently. They chose to break the cycle.</p>

          <h3 className={styles.subhead}>The Path to Law</h3>
          <p>I am currently in my fourth year of law studies at Uganda Christian University, pursuing a degree I believe is essential to the work of breaking cycles and transforming communities. I chose law because lasting change requires changing the systems that fail girls in the first place.</p>

          <p>I want to be the lawyer who stands between a girl and the teacher who would abuse her; who fights for policies allowing pregnant girls to return to school; who challenges discriminatory practices that favour boys over girls. My law degree will serve this initiative. This initiative will serve the community. And the community — one girl at a time — will transform this nation.</p>

          <h3 className={styles.subhead}>The Vision</h3>
          <p>My vision is simple and enormous: I want every girl in Ibanda District — every girl in Uganda — every girl in Africa — to have the chance I had. I want every Annet, every Grace, every Mary, every Robinah, every Sylvia to know that her beginning does not define her becoming.</p>

          <button className={styles.readMoreBtn} onClick={() => setExpanded(false)}>
            Show Less ↑
          </button>
        </>
      )}
    </div>
  );
}
