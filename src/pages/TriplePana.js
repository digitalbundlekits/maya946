import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TriplePana.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const TriplePana = () => {
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState({});
    const [gameType, setGameType] = useState('CLOSE'); // Default game type
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1; // Default to 1 if market ID not provided in state

    const triplePanaNumbers = ["111", "222", "333", "444", "555", "666", "777", "888", "999", "000"];

    // Determine the appropriate table and fields based on the market name
    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', marketId, gameTypeId: 15 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', marketId, gameTypeId: 15 };
        }
        return { table: 'bids', marketIdField: 'market', marketId, gameTypeId: 15 }; // Default for other markets
    };

    useEffect(() => {
        const fetchBalance = async () => {
            const userId = localStorage.getItem('user_id');
            const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
            setBalance(response.data.balance);
        };
        fetchBalance();
    }, []);

    const handlePointsChange = (digit, value) => {
        setPoints(prevPoints => ({
            ...prevPoints,
            [digit]: value.replace(/[^0-9]/g, '') // Only allow numeric values
        }));
    };

    const calculateBets = () => {
        return triplePanaNumbers.map(digit => ({
            digit,
            points: parseInt(points[digit] || 0),
            type: gameType
        })).filter(bet => bet.points > 0); // Only include bets with non-zero points
    };

    const totalBids = calculateBets().length;
    const totalAmount = calculateBets().reduce((sum, bet) => sum + bet.points, 0);

    const confirmSubmit = async () => {
        const allBets = calculateBets();
        const { table, marketIdField, gameTypeId } = getMarketAndGameType();
        const payload = {
            user_id: localStorage.getItem('user_id'),
            game_type: gameTypeId,
            type: gameType.toLowerCase(),
            market_table: table,
            market_id_field: marketIdField,
            market_id: marketId,
            bids: allBets,
            totalAmount,
            userbalance: balance - totalAmount,
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} TRIPLE PANNA`,
        };

        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', payload);
            if (response.data.success) {
                setBalance(prevBalance => prevBalance - totalAmount);
                setPoints({});
            } else {
                console.error('Error submitting bet:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bet:', error);
        }
    };

    return (
        <div className="triple-pana-container">
            <div className="headergj">
            <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, TRIPLE PANNA</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            <div className="game-type-selector">
                <label>Select Game Type:</label>
                <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                    <option value="CLOSE">CLOSE</option>
                    <option value="OPEN">OPEN</option>
                </select>
            </div>

            <div className="pana-inputs">
                {triplePanaNumbers.map((number) => (
                    <div key={number} className="pana-input">
                        <span className="pana-label">{number}</span>
                        <input
                            type="text"
                            placeholder="Enter amount"
                            value={points[number] || ''}
                            onChange={(e) => handlePointsChange(number, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <div className="bottom-bar">
                <span>Bid {totalBids}</span>
                <span>Total ₹{totalAmount}</span>
                <button className="submit-button" onClick={confirmSubmit} disabled={totalAmount === 0}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default TriplePana;
