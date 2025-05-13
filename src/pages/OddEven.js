import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/OddEven.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const OddEven = () => {
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState('');
    const [gameType, setGameType] = useState('CLOSE'); // Default game type
    const [selectedType, setSelectedType] = useState('EVEN'); // Default selection for Odd/Even
    const [bets, setBets] = useState([]); // Renamed 'bids' to 'bets'
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({});
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1; // Default to 1 if market ID not provided in state

    const digits = Array.from({ length: 10 }, (_, i) => i);

    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', marketId, gameTypeId: 9 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', marketId, gameTypeId: 9 };
        }
        return { table: 'bids', marketIdField: 'market', marketId, gameTypeId: 9 };
    };

    useEffect(() => {
        const fetchBalance = async () => {
            const userId = localStorage.getItem('user_id');
            const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
            setBalance(response.data.balance);
        };
        fetchBalance();
    }, []);

    const handleAddBet = () => {
        if (!points || parseInt(points) <= 0) {
            alert('Please enter a valid amount!');
            return;
        }

        const selectedDigits = selectedType === 'EVEN'
            ? digits.filter((digit) => digit % 2 === 0)
            : digits.filter((digit) => digit % 2 !== 0);

        const newBets = selectedDigits.map((digit) => ({
            digit,
            points: parseInt(points),
            type: 'close',
        }));

        setBets((prevBets) => [...prevBets, ...newBets]);
        setPoints('');
    };

    const handleRemoveBet = (index) => {
        setBets((prevBets) => prevBets.filter((_, i) => i !== index));
    };

    const totalBids = bets.length;
    const totalAmount = bets.reduce((sum, bet) => sum + bet.points, 0);

    const handleSubmit = () => {
        setShowReviewModal(true);
        setReviewData({
            bids: bets, // Use 'bets' instead of 'bids'
            totalBids,
            totalAmount,
            balanceBefore: balance,
            balanceAfter: balance - totalAmount,
        });
    };

    const confirmSubmit = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const { table, marketIdField, gameTypeId } = getMarketAndGameType();

            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', {
                user_id: userId,
                game_type: gameTypeId,
                type: 'close',
                market_table: table,
                market_id_field: marketIdField,
                market_id: marketId,
                bids: reviewData.bids, // Use reviewData.bids here
                totalAmount,
                userbalance: balance - totalAmount,
                message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} ODD EVEN`,
            });

            if (response.data.success) {
                setBalance((prevBalance) => prevBalance - totalAmount);
                setBets([]); // Reset the bets after successful submission
                setShowReviewModal(false);
            } else {
                alert(response.data.message || 'Failed to place bet.');
            }
        } catch (error) {
            console.error('Error submitting bet:', error);
        }
    };

    return (
        <div className="odd-even-container">
            <div className="headergj">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, ODD EVEN</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            <div className="game-type-selector">
                <label>Select Game Type: </label>
                <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                    <option value="CLOSE">CLOSE</option>
                    <option value="OPEN">OPEN</option>
                </select>
            </div> 

            <div className="selection">
                <label>
                    <input
                        type="radio"
                        name="odd-even"
                        value="ODD"
                        checked={selectedType === 'ODD'}
                        onChange={() => setSelectedType('ODD')}
                    />
                    ODD
                </label>
                <label>
                    <input
                        type="radio"
                        name="odd-even"
                        value="EVEN"
                        checked={selectedType === 'EVEN'}
                        onChange={() => setSelectedType('EVEN')}
                    />
                    EVEN
                </label>
            </div>

            <div className="points-input1">
                <label>Enter Points: </label>
                <input
                    type="text"
                    placeholder="Enter amount"
                    value={points}
                    onChange={(e) => setPoints(e.target.value.replace(/[^0-9]/g, ''))}
                />
                <button className="add-bid-button" onClick={handleAddBet}>
                    ADD BID
                </button>
            </div>

            <table className="bets-table">
                <thead>
                    <tr>
                        <th>Digit</th>
                        <th>Points</th>
                        <th>Game type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bets.map((bet, index) => (
                        <tr key={index}>
                            <td>{bet.digit}</td>
                            <td>{bet.points}</td>
                            <td>{bet.type}</td>
                            <td>
                                <button className="remove-bid" onClick={() => handleRemoveBet(index)}>
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                                {reviewData.bids.map((bid, index) => (
                                    <tr key={index}>
                                        <td>{bid.digit}</td>
                                        <td>{bid.points}</td>
                                        <td>{bid.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="review-summary">
                            <p>Total Bids: {reviewData.totalBids}</p>
                            <p>Total Bid Points: {reviewData.totalAmount}</p>
                            <p>Point Balance Before Game Play: ₹{reviewData.balanceBefore}</p>
                            <p>Point Balance After Game Play: ₹{reviewData.balanceAfter}</p>
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

export default OddEven;
