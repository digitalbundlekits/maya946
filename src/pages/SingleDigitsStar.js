import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SingleDigits.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const SingleDigits = () => {
    const [balance, setBalance] = useState(0);
    const [amounts, setAmounts] = useState(Array(10).fill(''));
    const gameType = 'CLOSE'; // Fixed game type
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({});
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1;

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
            try {
                const userId = localStorage.getItem('user_id');
                const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', {
                    user_id: userId,
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();
    }, []);

    const handleAmountChange = (index, value) => {
        const updatedAmounts = [...amounts];
        updatedAmounts[index] = value.replace(/[^0-9]/g, '');
        setAmounts(updatedAmounts);
    };

    const totalBids = amounts.filter((amount) => amount).length;
    const totalAmount = amounts.reduce((sum, amount) => sum + (parseInt(amount) || 0), 0);

    const handleSubmit = () => {
        setShowReviewModal(true);
        setReviewData({
            bids: amounts.map((amount, index) => amount && {
                digit: index,
                points: parseInt(amount),
                type: gameType,
            }).filter(Boolean),
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
                type: gameType.toLowerCase(),
                market_table: table,
                market_id_field: marketIdField,
                market_id: marketId,
                bids: reviewData.bids,
                totalAmount,
                userbalance: balance - totalAmount,
                message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} SINGLE`,
            });

            if (response.data.success) {
                setBalance((prevBalance) => prevBalance - totalAmount);
                setAmounts(Array(10).fill(''));
                setShowReviewModal(false);
            } else {
                console.error('Bid submission failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bid:', error);
        }
    };

    return (
        <div className="single-digits-container">
            <div className="headergj">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, SINGLE</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            {/* Game Type Info (Static)
            <div className="game-type-selector">
                <label>Game Type: <strong style={{ marginLeft: '10px' }}>CLOSE</strong></label>
            </div> */}

            {/* In your JSX */}
<div className="digit-inputs">
  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
    <div key={digit} className="digit-input">
      <span className="digit-label">{digit}</span>
      <input
        type="text"
        placeholder="Enter amount"
        value={amounts[digit]}
        onChange={(e) => handleAmountChange(digit, e.target.value)}
      />
    </div>
  ))}
  {/* Separate container for 0 */}
  <div className="zero-container">
    <div className="digit-input">
      <span className="digit-label">0</span>
      <input
        type="text"
        placeholder="Enter amount"
        value={amounts[0]}
        onChange={(e) => handleAmountChange(0, e.target.value)}
      />
    </div>
  </div>
</div>

            <div className="bottom-bar">
                <span>Bid: {totalBids}</span>
                <span>Total: ₹{totalAmount}</span>
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

export default SingleDigits;
