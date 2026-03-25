import styles from './ErrorScreen.module.css';

export default function ErrorScreen({ message, onRetry }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <span className={styles.icon}>✕</span>
        <h2 className={styles.title}>Something went wrong</h2>
        <p className={styles.message}>{message}</p>
        <button className={styles.retryBtn} onClick={onRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}
