import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SingleBulkDigits.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const SingleBulkDigits = () => {
    const [balance, setBalance] = useState(0);
    const [amounts, setAmounts] = useState(Array(10).fill(0));
    const gameType = 'CLOSE'; // Always CLOSE
    const [pointValue, setPointValue] = useState(); // Input value for placing bid
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({});
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1;

    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', marketId, gameTypeId: 10 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', marketId, gameTypeId: 10 };
        }
        return { table: 'bids', marketIdField: 'market', marketId, gameTypeId: 10 };
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

    const handleDigitClick = (index) => {
        if (!pointValue || pointValue <= 0) return;
        const updatedAmounts = [...amounts];
        updatedAmounts[index] += pointValue;
        setAmounts(updatedAmounts);
    };

    const handleHold = (index) => {
        const updatedAmounts = [...amounts];
        updatedAmounts[index] = 0;
        setAmounts(updatedAmounts);
    };

    const totalBids = amounts.filter(amount => amount > 0).length;
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);

    const handleSubmit = () => {
        setShowReviewModal(true);
        setReviewData({
            bids: amounts
                .map((amount, index) => amount > 0 && { digit: index, points: amount, type: gameType })
                .filter(Boolean),
            totalBids,
            totalAmount,
            balanceBefore: balance,
            balanceAfter: balance - totalAmount,
        });
    };

    const confirmSubmit = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const { table, marketIdField, marketId, gameTypeId } = getMarketAndGameType();

            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', {
                user_id: userId,
                game_type: gameTypeId,
                type: gameType.toLowerCase(),
                market_table: table,
                market_id_field: marketIdField,
                market_id: marketId,
                bids: reviewData.bids.map(bid => ({
                    digit: bid.digit,
                    points: bid.points,
                    type: bid.type
                })),
                totalAmount,
                userbalance: balance - totalAmount,
                message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} SINGLE BULK`
            });

            if (response.data.success) {
                setBalance(prev => prev - totalAmount);
                setAmounts(Array(10).fill(0));
                setShowReviewModal(false);
            } else {
                console.error('Bid submission failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bid:', error);
        }
    };

    return (
        <div className="single-bulk-digits-container">
            <div className="headergj">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, SINGLE BULK</h2>
            </div>

            {/* Removed game type dropdown completely */}

            <div className="point-input">
                <label>Enter Points: </label>
                <input
                    type="number"
                    min="1"
                    value={pointValue}
                    onChange={(e) => setPointValue(parseInt(e.target.value) || 0)}
                />
            </div>

            <p>Hold button to clear bet and click again to add points</p>

                        {/* In your JSX */}
<div className="digit-buttons">
  {/* First 9 digits in 3x3 grid */}
  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
    <button
      key={digit}
      className="digit-button"
      onClick={() => handleDigitClick(digit)}
      onContextMenu={(e) => { e.preventDefault(); handleHold(digit); }}
    >
      {digit}
      {amounts[digit] > 0 && <span className="bet-amount">{amounts[digit]}</span>}
    </button>
  ))}
  
  {/* Centered zero button */}
  <div className="zero-container">
    <button
      className="digit-button"
      onClick={() => handleDigitClick(0)}
      onContextMenu={(e) => { e.preventDefault(); handleHold(0); }}
    >
      0
      {amounts[0] > 0 && <span className="bet-amount">{amounts[0]}</span>}
    </button>
  </div>
</div>

            <div className="bottom-bar">
                <span>Bid {totalBids}</span>
                <span>Total ₹{totalAmount}</span>
                <button
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={totalAmount === 0}
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

export default SingleBulkDigits;
