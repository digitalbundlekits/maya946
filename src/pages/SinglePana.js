import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SinglePana.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const SinglePana = () => {
    const [balance, setBalance] = useState(0);
    const [amounts, setAmounts] = useState({});
    const [selectedRow, setSelectedRow] = useState(0); // Default to 0 row for initial display
    const [gameType, setGameType] = useState('CLOSE'); // Default game type
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({});
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1; // Ensure marketId is used correctly

    const panaNumbers = {
        0: ["136", "127", "145", "190", "235", "280", "370", "389", "460", "479", "578", "569"],
        1: ["128", "137", "146", "236", "245", "290", "380", "470", "489", "560", "579", "678"],
        2: ["138", "129", "147", "156", "237", "246", "345", "390", "480", "570", "679", "589"],
        3: ["139", "120", "148", "157", "238", "247", "256", "346", "490", "580", "689", "670"],
        4: ["149", "130", "158", "167", "239", "248", "257", "347", "356", "590", "789", "680"],
        5: ["159", "140", "168", "230", "249", "258", "267", "348", "357", "456", "780", "690"],
        6: ["150", "123", "169", "178", "240", "259", "268", "349", "358", "367", "790", "457"],
        7: ["160", "124", "179", "250", "269", "278", "340", "359", "368", "458", "890", "467"],
        8: ["134", "125", "170", "189", "260", "279", "350", "369", "378", "459", "567", "468"],
        9: ["135", "126", "180", "234", "270", "289", "360", "379", "450", "469", "568", "478"]
    };

    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', gameTypeId: 11 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', gameTypeId: 11 };
        }
        return { table: 'bids', marketIdField: 'market', gameTypeId: 11 }; // Default for other markets
    };

    useEffect(() => {
        const fetchBalance = async () => {
            const userId = localStorage.getItem('user_id');
            const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
            if (response.data) {
                setBalance(response.data.balance);
            }
        };
        fetchBalance();
    }, []);

    const handleRowSelect = (row) => {
        setSelectedRow(row);
        if (!amounts[row]) {
            const newRowAmounts = panaNumbers[row].map(() => '');
            setAmounts(prev => ({ ...prev, [row]: newRowAmounts }));
        }
    };

    const handleAmountChange = (index, value) => {
        const updatedAmounts = [...(amounts[selectedRow] || [])];
        updatedAmounts[index] = value.replace(/[^0-9]/g, '');
        setAmounts(prev => ({ ...prev, [selectedRow]: updatedAmounts }));
    };

    const totalBids = Object.values(amounts).flat().filter(Boolean).length;
    const totalAmount = Object.values(amounts).flat().reduce((sum, amount) => sum + (parseInt(amount) || 0), 0);

    const handleSubmit = () => {
        const bids = [];
        Object.entries(amounts).forEach(([row, values]) => {
            values.forEach((amount, index) => {
                if (amount) {
                    bids.push({ digit: panaNumbers[row][index], points: parseInt(amount), type: gameType });
                }
            });
        });
        setReviewData({ bids, totalBids, totalAmount, balanceBefore: balance, balanceAfter: balance - totalAmount });
        setShowReviewModal(true);
    };

    const confirmSubmit = async () => {
        const userId = localStorage.getItem('user_id');
        const { table, marketIdField, gameTypeId } = getMarketAndGameType();
        const payload = {
            user_id: userId,
            game_type: gameTypeId,
            type: gameType.toLowerCase(),
            market_table: table,
            market_id_field: marketIdField,
            market_id: marketId,
            bids: reviewData.bids,
            totalAmount,
            userbalance: balance - totalAmount,
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} SINGLE PANA`,
        };

        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', payload);
            if (response.data.success) {
                setBalance(balance - totalAmount);
                setAmounts({});
                setShowReviewModal(false);
            } else {
                console.error('Error submitting bet:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bet:', error);
        }
    };

    return (
        <div className="single-pana-container">
            <div className="headergj">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, SINGLE PANNA</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            <div className="row-selector">
                {Object.keys(panaNumbers).map(num => (
                    <button key={num} className={`row-button ${selectedRow === parseInt(num) ? 'active' : ''}`} onClick={() => handleRowSelect(parseInt(num))}>
                        {num}
                    </button>
                ))}
            </div>

            <div className="game-type-selector">
                <label>Select Game Type:</label>
                <select value={gameType} onChange={(e) => setGameType(e.target.value)}>
                    <option value="CLOSE">CLOSE</option>
                    <option value="OPEN">OPEN</option>
                </select>
            </div>

            <div className="pana-inputs">
                {panaNumbers[selectedRow]?.map((number, index) => (
                    <div key={index} className="pana-input">
                        <span className="pana-label">{number}</span>
                        <input type="text" placeholder="Enter amount" value={amounts[selectedRow]?.[index] || ''} onChange={(e) => handleAmountChange(index, e.target.value)} />
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
                            <p>Total Bids: {totalBids}</p>
                            <p>Total Bid Points: {totalAmount}</p>
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

export default SinglePana;
