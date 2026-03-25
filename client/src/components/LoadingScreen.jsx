import { useState, useEffect } from 'react';
import styles from './LoadingScreen.module.css';

const CHARACTERS = [
  { src: '/chars/darth-vader.png',  alt: 'Darth Vader' },
  { src: '/chars/indiana-jones.png', alt: 'Indiana Jones' },
  { src: '/chars/mickey-mouse.png', alt: 'Mickey Mouse' },
  { src: '/chars/batman.png',        alt: 'Batman' },
  { src: '/chars/james-bond.jpeg',   alt: 'James Bond' },
];

const HOLD_MS = 2100;
const FADE_MS = 350;

export default function LoadingScreen() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => {
          let next;
          do { next = Math.floor(Math.random() * CHARACTERS.length); } while (next === i);
          return next;
        });
        setVisible(true);
      }, FADE_MS);
    }, HOLD_MS);

    return () => clearTimeout(cycle);
  }, [idx]);

  const char = CHARACTERS[idx];

  return (
    <div className={styles.overlay}>
      <div
        className={styles.frame}
        style={{ opacity: visible ? 1 : 0, transition: `opacity ${FADE_MS}ms ease` }}
      >
        <img
          key={idx}
          src={char.src}
          alt={char.alt}
          className={styles.charImg}
        />
      </div>

      <p className={styles.hint}>Finding your next obsession…</p>
    </div>
  );
}
