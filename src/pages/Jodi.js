import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Jodi.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const Jodi = () => {
    const [balance, setBalance] = useState(0);
    const [amounts, setAmounts] = useState(Array(10).fill(0).map(() => Array(10).fill('')));
    const [selectedRow, setSelectedRow] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [reviewData, setReviewData] = useState({});
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1; // Correct market ID from state

    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', marketId, gameTypeId: 16 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', marketId, gameTypeId: 16 };
        }
        return { table: 'bids', marketIdField: 'market', marketId, gameTypeId: 16 };
    };

    useEffect(() => {
        const fetchBalance = async () => {
            const userId = localStorage.getItem('user_id');
            try {
                const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();
    }, []);

    const handleRowSelect = (row) => {
        setSelectedRow(row);
    };

    const handleAmountChange = (index, value) => {
        if (selectedRow === null) return;
        const updatedAmounts = [...amounts];
        updatedAmounts[selectedRow][index] = value.replace(/[^0-9]/g, '');
        setAmounts(updatedAmounts);
    };

    const totalBids = amounts.flat().filter(amount => amount).length;
    const totalAmount = amounts.flat().reduce((sum, amount) => sum + (parseInt(amount) || 0), 0);

    const handleSubmit = () => {
        const bids = [];
        amounts.forEach((row, rowIndex) => {
            row.forEach((amount, index) => {
                if (amount) {
                    bids.push({ digit: `${rowIndex}${index}`, points: parseInt(amount), type: 'OPEN' });
                }
            });
        });
        setReviewData({
            bids,
            totalBids,
            totalAmount,
            balanceBefore: balance,
            balanceAfter: balance - totalAmount,
        });
        setShowReviewModal(true);
    };

    const confirmSubmit = async () => {
        const userId = localStorage.getItem('user_id');
        const { table, marketIdField, marketId, gameTypeId } = getMarketAndGameType();
        const payload = {
            user_id: userId,
            game_type: gameTypeId,
            type: 'close',
            market_table: table,
            market_id_field: marketIdField,
            market_id: marketId,
            bids: reviewData.bids,
            totalAmount,
            userbalance: balance - totalAmount,
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} JODI`
        };
        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', payload);
            if (response.data.success) {
                setBalance(balance => balance - totalAmount);
                setAmounts(Array(10).fill(0).map(() => Array(10).fill('')));
                setShowReviewModal(false);
                setShowSuccessMessage(true);
                setTimeout(() => setShowSuccessMessage(false), 3000);
            } else {
                console.error('Error submitting bet:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bet:', error);
        }
    };

    return (
        <div className="jodi-container">
            <div className="headergj">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, JODI</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>
            <div className="row-selector">
                {[...Array(10).keys()].map(num => (
                    <button
                        key={num}
                        className={`row-button ${selectedRow === num ? 'active' : ''}`}
                        onClick={() => handleRowSelect(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <div className="jodi-inputs">
                {selectedRow !== null && amounts[selectedRow].map((amount, index) => (
                    <div key={index} className="jodi-input">
                        <span className="jodi-label">{`${selectedRow}${index}`}</span>
                        <input
                            type="text"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={e => handleAmountChange(index, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <div className="bottom-bar">
                <span>Bid {totalBids}</span>
                <span>Total {totalAmount}</span>
                <button className="submit-button" onClick={handleSubmit} disabled={totalAmount === 0}>
                    Submit
                </button>
            </div>
            {showSuccessMessage && (
                <div className="bet-placed-popup">Bet Placed Successfully!</div>
            )}
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

export default Jodi;
