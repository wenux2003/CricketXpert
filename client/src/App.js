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

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading players...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">CricketXpert Players</h1>

      {players.length === 0 ? (
        <p className="text-center text-gray-600">No players found.</p>
      ) : (
        <ul className="max-w-md mx-auto space-y-4">
          {players.map(player => (
            <li
              key={player._id}
              className="bg-white p-4 rounded shadow hover:bg-blue-50 transition"
            >
              {player.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
