import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Charts.css';

const Charts = () => {
  const [markets, setMarkets] = useState([]);
  const [starlineGames, setStarlineGames] = useState([]);
  const [jackpotGames, setJackpotGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await axios.get('https://bhoom.miramatka.com/api/marketApiname.php');
        if (response.data.success) {
          setMarkets(response.data.markets);
        } else {
          console.error('Error fetching markets:', response.data.message);
          setMarkets([]);
        }
      } catch (error) {
        console.error('Error fetching markets:', error);
        setMarkets([]);
      }
    };

    const fetchStarlineGames = async () => {
      try {
        const response = await axios.get('https://bhoom.miramatka.com/api/starlineApiname.php');
        if (response.data.success) {
          const sortedGames = formatAndSortGames(response.data.starlines);
          setStarlineGames(sortedGames);
        } else {
          console.error('Error fetching starline games:', response.data.message);
          setStarlineGames([]);
        }
      } catch (error) {
        console.error('Error fetching starline games:', error);
        setStarlineGames([]);
      }
    };

    const fetchJackpotGames = async () => {
      try {
        const response = await axios.get('https://bhoom.miramatka.com/api/jackpotApiname.php');
        if (response.data.success) {
          const sortedGames = formatAndSortGames(response.data.jackpots);
          setJackpotGames(sortedGames);
        } else {
          console.error('Error fetching jackpot games:', response.data.message);
          setJackpotGames([]);
        }
      } catch (error) {
        console.error('Error fetching jackpot games:', error);
        setJackpotGames([]);
      }
    };

    const formatAndSortGames = (games) => {
      const formattedGames = games.map((game) => ({
        ...game,
        stime: convertTo12HourFormat(game.stime),
      }));
      return formattedGames.sort((a, b) => compareTime(a.stime, b.stime));
    };

    const convertTo12HourFormat = (time24) => {
      // Removed "second" from the destructuring to prevent unused variable warning
      const [hour, minute] = time24.split(':');
      const hour12 = ((+hour + 11) % 12) + 1;
      const amPm = +hour >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minute} ${amPm}`;
    };

    const compareTime = (timeA, timeB) => {
      const parseTime = (time) => {
        const [hourMinute, amPm] = time.split(' ');
        const [hour, minute] = hourMinute.split(':').map(Number);
        const adjustedHour = hour % 12 + (amPm === 'PM' ? 12 : 0);
        return adjustedHour * 60 + minute;
      };
      return parseTime(timeA) - parseTime(timeB);
    };

    fetchMarkets();
    fetchStarlineGames();
    fetchJackpotGames();
  }, []);

  const handleMainMarketClick = (marketId) => {
    navigate(`/charts/${marketId}`); // Navigate to Charts.js with market ID
  };

  const handleStarlineClick = (gameId) => {
    navigate(`/starlinechart/${gameId}`); // Navigate to StarlineChart.js with game ID
  };

  const handleJackpotClick = (gameId) => {
    navigate(`/jackpotchart/${gameId}`); // Navigate to JackpotChart.js with game ID
  };

  return (
    <div className="charts-container">
      <div className="header">
        <button onClick={() => navigate(-1)} className="back-buttonms">
          <img src="/assets/back-arrow.png" alt="Back" />
        </button>
        <h2>Charts</h2>
      </div>

      <h3 className="center-heading">Main Market Charts</h3>
      <div className="market-grid">
        {markets.length > 0 ? (
          markets.map((market) => (
            <button
              key={market.id}
              className="market-button"
              onClick={() => handleMainMarketClick(market.id)}
            >
              {market.market_name}
            </button>
          ))
        ) : (
          <p>No markets available</p>
        )}
      </div>

      <h3 className="center-heading">Starline Charts</h3>
      <div className="market-grid">
        {starlineGames.length > 0 ? (
          starlineGames.map((game) => (
            <button
              key={game.id}
              className="market-button"
              onClick={() => handleStarlineClick(game.id)}
            >
              {game.stime}
            </button>
          ))
        ) : (
          <p>No starline games available</p>
        )}
      </div>

      <h3 className="center-heading">Jackpot Charts</h3>
      <div className="market-grid">
        {jackpotGames.length > 0 ? (
          jackpotGames.map((game) => (
            <button
              key={game.id}
              className="market-button"
              onClick={() => handleJackpotClick(game.id)}
            >
              {game.stime}
            </button>
          ))
        ) : (
          <p>No jackpot games available</p>
        )}
      </div>
    </div>
  );
};

export default Charts;
