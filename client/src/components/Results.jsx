import { useState, useRef } from 'react';
import ShowCard from './ShowCard.jsx';
import styles from './Results.module.css';

export default function Results({ recommendations, onReset }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const touchStartX = useRef(null);

  function prev() {
    setDirection('left');
    setIndex((i) => Math.max(i - 1, 0));
  }

  function next() {
    setDirection('right');
    setIndex((i) => Math.min(i + 1, recommendations.length - 1));
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 50) next();
    else if (delta < -50) prev();
    touchStartX.current = null;
  }

  const total = recommendations.length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your Picks</h1>
        <p className={styles.subtitle}>{index + 1} of {total}</p>
      </header>

      <div
        className={styles.stage}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous"
        >
          ‹
        </button>

        <div
          key={index}
          className={`${styles.cardWrapper} ${direction === 'right' ? styles.slideFromRight : styles.slideFromLeft}`}
        >
          <ShowCard rec={recommendations[index]} />
        </div>

        <button
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={next}
          disabled={index === total - 1}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <div className={styles.dots}>
        {recommendations.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => { setDirection(i > index ? 'right' : 'left'); setIndex(i); }}
            aria-label={`Go to recommendation ${i + 1}`}
          />
        ))}
      </div>

      <button className={styles.resetBtn} onClick={onReset}>
        ↩ Start Over
      </button>
    </div>
  );
}
