import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/JodiBulk.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const JodiBulk = () => {
    const [balance, setBalance] = useState(0);
    const [pointValue, setPointValue] = useState();
    const [digitInput, setDigitInput] = useState('');
    const [jodiOptions, setJodiOptions] = useState([]);
    const [bets, setBets] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1;
    const gameType = 'close';

    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', gameTypeId: 17 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', gameTypeId: 17 };
        }
        return { table: 'bids', marketIdField: 'market', gameTypeId: 17 };
    };

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();
    }, []);

    const handleDigitChange = (value) => {
        setDigitInput(value);
        if (value.length === 2) {
            const prefix = value[0] + '0';
            const options = Array.from({ length: 10 }, (_, i) => parseInt(prefix) + i);
            setJodiOptions(options);
        } else {
            setJodiOptions([]);
        }
    };

    const handleJodiSelect = (jodi) => {
        const padded = jodi.toString().padStart(2, '0');
        const newBet = { digit: padded, points: pointValue, type: gameType };
        setBets([...bets, newBet]);
        setDigitInput('');
        setJodiOptions([]);
    };

    const handleRemoveBet = (index) => {
        setBets(bets.filter((_, i) => i !== index));
    };

    const totalBids = bets.length;
    const totalAmount = bets.reduce((sum, bet) => sum + bet.points, 0);

    const handleSubmit = () => {
        setShowReviewModal(true);
    };

    const confirmSubmit = async () => {
        const userId = localStorage.getItem('user_id');
        const { table, marketIdField, gameTypeId } = getMarketAndGameType();
        const payload = {
            user_id: userId,
            game_type: gameTypeId,
            type: gameType,
            market_table: table,
            market_id_field: marketIdField,
            market_id: marketId,
            bids: bets,
            totalAmount,
            userbalance: balance - totalAmount,
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} JODI BULK`,
        };

        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', payload);
            if (response.data.success) {
                setBalance(prev => prev - totalAmount);
                setBets([]);
                setShowReviewModal(false);
            } else {
                console.error('Error submitting bet:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bet:', error);
        }
    };

    return (
        <div className="jodi-bulk-container">
            <div className="headergj">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, JODI BULK</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            <div className="input-section">
                <div className="input-field">
                    <label>Enter Points:</label>
                    <input
                        type="number"
                        value={pointValue}
                        min="1"
                        onChange={(e) => setPointValue(parseInt(e.target.value) || 0)}
                    />
                </div>
                <div className="input-field">
                    <label>Enter Digit:</label>
                    <input
                        type="text"
                        value={digitInput}
                        onChange={(e) => handleDigitChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                    />
                </div>

                {jodiOptions.length > 0 && (
                    <div className="dropdown">
                        {jodiOptions.map((option) => (
                            <div
                                key={option}
                                className="dropdown-item"
                                onClick={() => handleJodiSelect(option)}
                            >
                                {option.toString().padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="bet-list">
                {bets.map((bet, index) => (
                    <div key={index} className="bet-item">
                        <span>{bet.digit}</span>
                        <span>{bet.points}</span>
                        <span>{bet.type}</span>
                        <button className="remove-button" onClick={() => handleRemoveBet(index)}>
                            🗑️
                        </button>
                    </div>
                ))}
            </div>

            <div className="bottom-bar">
                <span>Bid {totalBids}</span>
                <span>Total ₹{totalAmount}</span>
                <button className="submit-button" onClick={handleSubmit} disabled={totalAmount === 0}>
                    Submit
                </button>
            </div>

            {showReviewModal && (
                <div className="modal-overlay">
                    <div className="review-modal">
                        <h3>Review Bets</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Digit</th>
                                    <th>Points</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bets.map((bid, index) => (
                                    <tr key={index}>
                                        <td>{bid.digit}</td>
                                        <td>{bid.points}</td>
                                        <td>{bid.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="review-summary">
                            <p>Total Bids: {totalBids}</p>
                            <p>Total Bid Points: {totalAmount}</p>
                            <p>Point Balance Before Game Play: ₹{balance}</p>
                            <p>Point Balance After Game Play: ₹{balance - totalAmount}</p>
                            <p style={{ color: 'red' }}>Note: Bid Once Played Cannot Be Cancelled</p>
                        </div>
                        <div className="modal-buttons">
                            <button onClick={() => setShowReviewModal(false)} className="cancel-button">Cancel</button>
                            <button onClick={confirmSubmit} className="confirm-button">Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JodiBulk;
