import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Jackpot.css';
import { useNavigate } from 'react-router-dom';

// Use MARKET_OPEN_TIME to define 01:00:00
const MARKET_OPEN_TIME = '01:00:00';

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

const determineStatus = (etime, now) => {
  // Convert MARKET_OPEN_TIME => 1:00 AM
  const openTime = new Date(now);
  const [openHrs, openMins] = MARKET_OPEN_TIME.split(':').map(Number);
  openTime.setHours(openHrs, openMins, 0, 0);

  // Now convert end time (etime) => Date object
  const endTime = new Date(now);
  const [endHrs, endMins] = etime.split(':').map(Number);
  endTime.setHours(endHrs, endMins, 0);

  // 5-minute cutoff
  const cutoffTime = new Date(endTime);
  cutoffTime.setMinutes(cutoffTime.getMinutes() - 5);

  // If now < 1:00 AM => 'closed'
  if (now < openTime) {
    return 'closed';
  }

  // If 1:00 AM <= now < (endTime - 5min) => 'running'
  if (now >= openTime && now < cutoffTime) {
    return 'running';
  }

  // Otherwise => 'closed'
  return 'closed';
};

const Jackpot = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          'https://bhoom.miramatka.com/api/getJackpotGames.php'
        );
        if (response.data.success) {
          const now = new Date(
            new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
          );

          const fetchedGames = response.data.games.map((game) => {
            const status = determineStatus(game.etime, now);

            return {
              ...game,
              result: game.result === '**' ? '**' : game.result,
              status,
              // We only format etime for display
              formattedEndTime: formatTime12Hour(game.etime),
            };
          });

          // Sort: running first
          const sortedGames = fetchedGames.sort((a, b) => {
            if (a.status === 'running' && b.status !== 'running') return -1;
            if (a.status !== 'running' && b.status === 'running') return 1;
            return 0;
          });

          setGames(sortedGames);
        }
      } catch (error) {
        console.error('Error fetching jackpot games:', error);
      }
    };

    fetchGames();
  }, []);

  const handlePlayGame = (marketId) => {
    navigate(`/gameOptionsstar/Mira Jackpot`, {
      state: { marketName: 'Mira Jackpot', marketId },
    });
  };

  return (
    <div className="jackpot-container">
      {/* Header Section */}
      <div className="jackpot-header">
        <button onClick={() => navigate(-1)} className="back-buttonms">
          <img src="/assets/back-arrow.png" alt="Back" />
        </button>
        <h2>Jackpot Games</h2>
      </div>

      {/* Games List */}
      <div className="jackpot-games-list">
        {games.map((game) => (
          <div key={game.market_id} className="jackpot-game-card">
            <div className="jackpot-card-top">
              <div className="jackpot-time">
                {game.formattedEndTime}
              </div>
              <div className="jackpot-clock-icon">⏰</div>
            </div>
            <div className="jackpot-result">
              {game.result || '***-**-***'}
            </div>
            <div className={`jackpot-status ${game.status}`}>
              {game.status === 'running' 
                ? 'Running' 
                : 'Closed for Today'
              }
            </div>
            <button
              className="jackpot-play-button"
              onClick={() => handlePlayGame(game.market_id)}
              disabled={game.status === 'closed'}
            >
              ▶ Play Game
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jackpot;
