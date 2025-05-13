import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Starline.css';
import { useNavigate } from 'react-router-dom';

// Use MARKET_OPEN_TIME so ESLint won't complain.
const MARKET_OPEN_TIME = '01:00:00';

// Utility function to format time as 12-hour
const formatTime12Hour = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  }).format(date);
};

// Updated to reference MARKET_OPEN_TIME
const determineStatus = (etime, now) => {
  // Parse "01:00:00"
  const openTime = new Date(now);
  const [openHours, openMinutes] = MARKET_OPEN_TIME.split(':').map(Number);
  openTime.setHours(openHours, openMinutes, 0, 0);

  // Convert etime => Date
  const endTime = new Date(now);
  const [endHours, endMinutes] = etime.split(':').map(Number);
  endTime.setHours(endHours, endMinutes, 0);

  // Market closes 5 min before etime
  const cutoffTime = new Date(endTime);
  cutoffTime.setMinutes(cutoffTime.getMinutes() - 5);

  // If now < openTime => closed
  if (now < openTime) return 'closed';
  // If openTime <= now < cutoffTime => running
  if (now >= openTime && now < cutoffTime) return 'running';
  // Otherwise => closed
  return 'closed';
};

const Starline = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          'https://bhoom.miramatka.com/api/getStarlineGames.php'
        );
        if (response.data.success) {
          const now = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
          );

          const fetchedGames = response.data.games.map((game) => {
            const status = determineStatus(game.etime, now);

            return {
              ...game,
              // Format only etime for display
              formattedEndTime: formatTime12Hour(game.etime),
              status,
            };
          });

          // Sort running first
          const sortedGames = fetchedGames.sort((a, b) => {
            if (a.status === 'running' && b.status !== 'running') return -1;
            if (a.status !== 'running' && b.status === 'running') return 1;
            return 0;
          });

          setGames(sortedGames);
        }
      } catch (error) {
        console.error('Error fetching starline games:', error);
      }
    };

    fetchGames();
  }, []);

  const handlePlayGame = (marketId) => {
    navigate(`/gameOptionsstar/Mira Starline`, {
      state: { marketName: 'Mira Starline', marketId },
    });
  };

  return (
    <div className="starline-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-buttonms">
          <img src="/assets/back-arrow.png" alt="Back" />
        </button>
        <h2>Starline Games</h2>
      </div>

      <div className="games-list">
        {games.map((game) => (
          <div key={game.market_id} className="game-item">
            <div className="game-left">
              <div className="game-time">
                <span className="clock-icon">⏰</span>
                <span>{game.formattedEndTime}</span>
              </div>
              <div className={`game-status ${game.status}`}>
                {game.status === 'running'
                  ? 'Market Running'
                  : 'Closed for Today'}
              </div>
            </div>
            <div className="game-right">
              <button
                className="play-button"
                onClick={() => handlePlayGame(game.market_id)}
                disabled={game.status === 'closed'}
              >
                ▶
              </button>
              <span className="play-text">Play Game</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Starline;
