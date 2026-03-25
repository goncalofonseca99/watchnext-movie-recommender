import { useState } from 'react';
import Wizard from './components/Wizard.jsx';
import Results from './components/Results.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ErrorScreen from './components/ErrorScreen.jsx';

export default function App() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(shows) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setRecommendations(null);
    setError(null);
  }

  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen message={error} onRetry={handleReset} />;

  if (recommendations) {
    return <Results recommendations={recommendations} onReset={handleReset} />;
  }

  return <Wizard onSubmit={handleSubmit} />;
}
