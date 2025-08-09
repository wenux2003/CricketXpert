import React, { useEffect, useState } from 'react';

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/players')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch players');
        return res.json();
      })
      .then(data => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading players...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>CricketXpert Players</h1>
      {players.length === 0 ? (
        <p>No players found.</p>
      ) : (
        <ul>
          {players.map(player => (
            <li key={player._id}>{player.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
