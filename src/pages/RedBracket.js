import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import '../styles/RedBracket.css';

const RedBracket = () => {
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState('');
    const [bets, setBets] = useState([]);
    const [selectedBracket, setSelectedBracket] = useState('Full Bracket'); // Default to Full Bracket
     // Default to CLOSE
    const [showReviewModal, setShowReviewModal] = useState(false);
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1; // Default to 1 if market ID not provided in state

    // Define the numbers for half and full brackets
    const fullBracketNumbers = ["00", "11", "22", "33", "44", "55", "66", "77", "88", "99"];
    const halfBracketNumbers = ["05", "16", "27", "38", "49", "50", "61", "72", "83", "94"];

    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', gameTypeId: 16 }; // GameTypeId for Mira Starline Red Bracket
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', gameTypeId: 16 }; // GameTypeId for Mira Jackpot Red Bracket
        }
        return { table: 'bids', marketIdField: 'market', gameTypeId: 16 }; // Default for other markets
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

    const handleAddBet = () => {
        const bracketNumbers = selectedBracket === 'Full Bracket' ? fullBracketNumbers : halfBracketNumbers;

        const newBets = bracketNumbers.map((digit) => ({
            digit,
            points: parseInt(points || 0),
            type: 'close',
        }));

        const filteredBets = newBets.filter((bet) => bet.points > 0); // Only include bets with non-zero points

        setBets((prevBets) => [...prevBets, ...filteredBets]);
        setPoints(''); // Clear the points input
    };

    const handleRemoveBet = (index) => {
        setBets((prevBets) => prevBets.filter((_, i) => i !== index));
    };

    const calculateTotalPoints = () => bets.reduce((sum, bet) => sum + bet.points, 0);

    const confirmSubmit = async () => {
        const { table, marketIdField, gameTypeId } = getMarketAndGameType(); // Get table, field, and game type ID
        const payload = {
            user_id: localStorage.getItem('user_id'),
            game_type: gameTypeId, // Use the gameTypeId from getMarketAndGameType
            type: 'close',
            market_table: table,
            market_id_field: marketIdField,
            market_id: marketId,
            bids: bets,
            totalAmount: calculateTotalPoints(),
            userbalance: balance - calculateTotalPoints(),
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} RED BRACKET`,
        };
    
        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', payload);
            if (response.data.success) {
                setBalance((prevBalance) => prevBalance - calculateTotalPoints());
                setBets([]); // Clear bets after submission
                setShowReviewModal(false);
            } else {
                console.error('Error submitting bets:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bets:', error);
        }
    };
    

    return (
        <div className="red-bracket-container">
            <div className="headergj">
            <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, RED BRACKET</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            <div className="game-type-selector">
                <label>
                    <input
                        type="radio"
                        name="bracketType"
                        value="Half Bracket"
                        checked={selectedBracket === 'Half Bracket'}
                        onChange={() => setSelectedBracket('Half Bracket')}
                    />
                    Half Bracket
                </label>
                <label>
                    <input
                        type="radio"
                        name="bracketType"
                        value="Full Bracket"
                        checked={selectedBracket === 'Full Bracket'}
                        onChange={() => setSelectedBracket('Full Bracket')}
                    />
                    Full Bracket
                </label>
            </div>

            {/* <div className="game-type-selector">
                <label>Select Game Type:</label>
                <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                    <option value="CLOSE">CLOSE</option>
                    <option value="OPEN">OPEN</option>
                </select>
            </div> */}

            <div className="points-input1">
                <label>Enter Points:</label>
                <input
                    type="text"
                    value={points}
                    onChange={(e) => setPoints(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter points"
                />
                <button className="add-bid-button" onClick={handleAddBet}>
                    ADD BID
                </button>
            </div>

            <table className="bids-table">
                <thead>
                    <tr>
                        <th>Digit</th>
                        <th>Points</th>
                        
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bets.map((bet, index) => (
                        <tr key={index}>
                            <td>{bet.digit}</td>
                            <td>{bet.points}</td>
                            
                            <td>
                                <button className="delete-button" onClick={() => handleRemoveBet(index)}>
                                🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="bottom-bar">
                <span>Bid {bets.length}</span>
                <span>Total ₹{calculateTotalPoints()}</span>
                <button
                    className="submit-button"
                    onClick={() => setShowReviewModal(true)}
                    disabled={bets.length === 0}
                >
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
                                {bets.map((bet, index) => (
                                    <tr key={index}>
                                        <td>{bet.digit}</td>
                                        <td>{bet.points}</td>
                                        <td>{bet.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="review-summary">
                            <p>Total Bids: {bets.length}</p>
                            <p>Total Bid Points: {calculateTotalPoints()}</p>
                            <p>Point Balance Before Game Play: ₹{balance}</p>
                            <p>Point Balance After Game Play: ₹{balance - calculateTotalPoints()}</p>
                            <p style={{ color: 'red' }}>Note: Bid Once Played Cannot Be Cancelled</p>
                        </div>
                        <div className="modal-buttons">
                            <button className="cancel-button" onClick={() => setShowReviewModal(false)}>
                                Cancel
                            </button>
                            <button className="confirm-button" onClick={confirmSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RedBracket;
