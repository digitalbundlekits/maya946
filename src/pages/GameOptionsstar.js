import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/GameOptions.css';

const GameOptions = () => {
    const { marketName } = useParams(); // Market name from the URL
    const { state } = useLocation(); // Receive state from navigation
    const [markets, setMarkets] = useState([]); // Store market data from API
    const navigate = useNavigate();
    const marketId = state?.marketId; // Retrieve marketId from state, ensure it's passed correctly

    useEffect(() => {
        // Fetch all markets from the market API
        const fetchMarkets = async () => {
            try {
                const response = await axios.get('https://bhoom.miramatka.com/api/marketApi.php');
                setMarkets(response.data); // Assuming response.data contains an array of markets
            } catch (error) {
                console.error('Error fetching markets:', error);
            }
        };
        fetchMarkets();
    }, []);

    // Determine the display market name
    const displayMarketName = () => {
        if (marketName === 'Mira Starline') {
            return 'Mira Starline';
        } else if (marketName === 'Mira Jackpot') {
            return 'Mira Jackpot';
        } else {
            const market = markets.find((m) => m.market_id === marketId);
            return market ? market.market_name : marketName;
        }
    };

    // Define game options for all markets
    const allGameOptions = [
        { name: 'Single Digits', path: `/singleDigitsstar/${marketName}`, icon: '/assets/ic_singledigits.png' },
        { name: 'Single Bulk Digits', path: `/singleBulkDigitsstar/${marketName}`, icon: '/assets/ic_singledigits.png' },
        { name: 'Jodi', path: `/jodistar/${marketName}`, icon: '/assets/jodi.png' },
        { name: 'Jodi Bulk', path: `/jodiBulkstar/${marketName}`, icon: '/assets/jodi.png' },
        { name: 'Single Pana', path: `/singlePanastar/${marketName}`, icon: '/assets/single_pana.png' },
        { name: 'Single Pana Bulk', path: `/singlePanaBulkstar/${marketName}`, icon: '/assets/single_pana.png' },
        { name: 'Double Pana', path: `/doublePanastar/${marketName}`, icon: '/assets/doublepana.png' },
        { name: 'Double Pana Bulk', path: `/doublePanaBulkstar/${marketName}`, icon: '/assets/doublepana.png' },
        { name: 'Triple Pana', path: `/triplePanastar/${marketName}`, icon: '/assets/triplepana.png' },
        { name: 'Odd Even', path: `/oddEvenstar/${marketName}`, icon: '/assets/jodi.png' },
        { name: 'Red Bracket', path: `/redBracketstar/${marketName}`, icon: '/assets/red_bracket.png' },
        { name: 'Group Jodi', path: `/groupJodistar/${marketName}`, icon: '/assets/group_jodi.png' },        
        { name: 'Half Sangam A', path: `/halfSangamOpenbstar/${marketName}`, icon: '/assets/group_jodi.png' },
        { name: 'Half Sangam B', path: `/halfSangamOpenstar/${marketName}`, icon: '/assets/group_jodi.png' },
        { name: 'Full Sangam', path: `/halfSangamClosestar/${marketName}`, icon: '/assets/group_jodi.png' },
    ];

    // Conditionally render game options based on the market name
    const gameOptions = marketName === 'Mira Starline'
        ? allGameOptions.filter((option) =>
              ['Single Digits', 'Single Bulk Digits', 'Single Pana', 'Single Pana Bulk', 'Triple Pana', 'Double Pana', 'Double Pana Bulk'].includes(option.name)
          )
        : marketName === 'Mira Jackpot'
        ? allGameOptions.filter((option) =>
              ['Jodi', 'Jodi Bulk', 'Red Bracket', 'Group Jodi'].includes(option.name)
          )
        : allGameOptions; // Show all games if navigated from Home.js or another market

    const handleNavigation = (optionPath) => {
        navigate(optionPath, { state: { marketId, marketName: displayMarketName() } });
    };

    return (
        <div className="game-options-container">
            <header className="game-options-header">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h2>{displayMarketName()}</h2>
            </header>
            <div className="game-options-grid">
                {gameOptions.map((option, index) => (
                    <div key={index} className="game-option-card" onClick={() => handleNavigation(option.path)}>
                        <img src={option.icon} alt={option.name} className="game-option-icon" />
                        <span>{option.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameOptions;
