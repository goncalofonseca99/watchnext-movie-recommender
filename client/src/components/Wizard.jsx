import { useState } from 'react';
import styles from './Wizard.module.css';

const STEPS = [
  { label: 'First movie', placeholder: 'e.g. The Godfather' },
  { label: 'Second movie', placeholder: 'e.g. Inception' },
  { label: 'Third movie', placeholder: 'e.g. Interstellar' },
];

export default function Wizard({ onSubmit, loading }) {
  const [step, setStep] = useState(0);
  const [shows, setShows] = useState(['', '', '']);

  function handleChange(value) {
    const updated = [...shows];
    updated[step] = value;
    setShows(updated);
  }

  function handleNext() {
    if (step < 2) setStep(step + 1);
    else onSubmit(shows);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && shows[step].trim()) handleNext();
  }

  const isLast = step === 2;
  const canContinue = shows[step].trim().length > 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>🎬 WatchNext</h1>
        <p className={styles.tagline}>Tell us 3 movies you love. We'll find your next obsession.</p>
      </header>

      <div className={styles.card}>
        <div className={styles.progress}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}
            />
          ))}
        </div>

        <p className={styles.stepLabel}>Step {step + 1} of 3</p>
        <h2 className={styles.question}>{STEPS[step].label}</h2>

        <input
          className={styles.input}
          type="text"
          value={shows[step]}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={STEPS[step].placeholder}
          autoFocus
          disabled={loading}
        />

        <div className={styles.actions}>
          {step > 0 && (
            <button className={styles.backBtn} onClick={handleBack} disabled={loading}>
              ← Back
            </button>
          )}
          <button
            className={styles.nextBtn}
            onClick={handleNext}
            disabled={!canContinue || loading}
          >
            {loading
              ? 'Finding shows…'
              : isLast
              ? 'Get Recommendations →'
              : 'Next →'}
          </button>
        </div>
      </div>

      {shows.some(Boolean) && (
        <div className={styles.picks}>
          {shows.filter(Boolean).map((s, i) => (
            <span key={i} className={styles.pill}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
