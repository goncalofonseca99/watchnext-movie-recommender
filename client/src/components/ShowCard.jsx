import styles from './ShowCard.module.css';

const PLATFORM_COLORS = {
  Netflix: '#e50914',
  'HBO Max': '#8b44dc',
  'Apple TV+': '#555555',
  'Disney+': '#1134a6',
  Hulu: '#1ce783',
  'Amazon Prime': '#00a8e0',
  'Paramount+': '#0064ff',
  Peacock: '#f5c518',
};

function PlatformBadge({ name }) {
  const color = PLATFORM_COLORS[name] ?? '#444466';
  return (
    <span className={styles.platform} style={{ background: color }}>
      {name}
    </span>
  );
}

export default function ShowCard({ rec }) {
  return (
    <div className={styles.card}>
      {rec.trailer_key ? (
        <div className={styles.trailer}>
          <iframe
            src={`https://www.youtube.com/embed/${rec.trailer_key}?rel=0&modestbranding=1`}
            title={`${rec.title} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
            referrerPolicy="strict-origin-when-cross-origin"
            className={styles.iframe}
          />
        </div>
      ) : rec.poster ? (
        <div className={styles.posterWrapper}>
          <img src={rec.poster} alt={rec.title} className={styles.poster} />
        </div>
      ) : (
        <div className={styles.noTrailer}>No preview available</div>
      )}

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>{rec.title}</h2>
          {rec.imdb_score && (
            <span className={styles.imdb}>
              <span className={styles.imdbLogo}>IMDb</span>
              {rec.imdb_score}
            </span>
          )}
        </div>

        <p className={styles.why}>{rec.why_it_matches}</p>

        {rec.where_to_watch?.length > 0 && (
          <div className={styles.platforms}>
            {rec.where_to_watch.map((p) => (
              <PlatformBadge key={p} name={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
