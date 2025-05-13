import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SinglePanaBulk.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const SinglePanaBulk = () => {
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState('');
    const [bets, setBets] = useState([]);
    const gameType = 'CLOSE'; // Hardcoded CLOSE
    const [showReviewModal, setShowReviewModal] = useState(false);
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1;

    const panaNumbers = {
        0: ["136", "127", "145", "190", "235", "280", "370", "389", "460", "479", "578", "569"],
        1: ["128", "137", "146", "236", "245", "290", "380", "470", "489", "560", "579", "678"],
        2: ["138", "129", "147", "156", "237", "246", "345", "390", "480", "570", "679", "589"],
        3: ["131", "120", "148", "157", "238", "247", "256", "346", "490", "580", "689", "670"],
        4: ["149", "130", "158", "167", "239", "248", "257", "347", "356", "590", "789", "680"],
        5: ["159", "140", "168", "230", "249", "258", "267", "348", "357", "456", "780", "690"],
        6: ["150", "123", "169", "178", "240", "259", "268", "349", "358", "367", "790", "457"],
        7: ["160", "124", "179", "250", "269", "278", "340", "359", "368", "458", "890", "467"],
        8: ["134", "125", "170", "189", "260", "279", "350", "369", "378", "459", "567", "468"],
        9: ["135", "126", "180", "234", "270", "289", "360", "379", "450", "469", "568", "478"]
    };

    const getMarketAndGameType = () => {
        switch (marketName) {
            case 'Mira Starline':
                return { table: 'sbids', marketIdField: 'starline', gameTypeId: 12 };
            case 'Mira Jackpot':
                return { table: 'jbids', marketIdField: 'jackpot', gameTypeId: 12 };
            default:
                return { table: 'bids', marketIdField: 'market', gameTypeId: 12 };
        }
    };

    useEffect(() => {
        const fetchBalance = async () => {
            const userId = localStorage.getItem('user_id');
            const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
            setBalance(response.data.balance);
        };
        fetchBalance();
    }, []);

    const handlePointsChange = (value) => {
        setPoints(value.replace(/[^0-9]/g, ''));
    };

    const placeBetForRow = (row) => {
        if (points) {
            const rowBets = panaNumbers[row].map(number => ({
                digit: number,
                points: parseInt(points, 10),
                type: gameType
            }));
            setBets(prevBets => [...prevBets, ...rowBets]);
        }
    };

    const handleRemoveBet = index => {
        setBets(bets.filter((_, i) => i !== index));
    };

    const totalBids = bets.length;
    const totalAmount = bets.reduce((sum, bet) => sum + bet.points, 0);

    const handleSubmit = () => {
        if (totalAmount > 0) {
            setShowReviewModal(true);
        }
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
            bids: bets,
            totalAmount,
            userbalance: balance - totalAmount,
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} SINGLE PANNA BULK`,
        };

        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', payload);
            if (response.data.success) {
                setBalance(balance - totalAmount);
                setBets([]);
                setPoints('');
                setShowReviewModal(false);
            } else {
                console.error('Error submitting bet:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bet:', error);
        }
    };

    return (
        <div className="single-pana-bulk-container">
            <div className="headergj">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, SINGLE PANNA BULK</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            {/* Removed game type dropdown completely */}

            <div className="points-input">
                <label>Enter Points:</label>
                <input
                    type="number"
                    placeholder="Enter points"
                    value={points}
                    onChange={e => handlePointsChange(e.target.value)}
                />
            </div>

            <div className="row-selector">
                {Object.keys(panaNumbers).map(num => (
                    <button
                        key={num}
                        className="row-button"
                        onClick={() => placeBetForRow(num)}
                        disabled={!points}
                    >
                        {num}
                    </button>
                ))}
            </div>

            <div className="bet-list">
                {bets.map((bet, index) => (
                    <div key={index} className="bet-item">
                        <span>{bet.digit}</span>
                        <span>{bet.points}</span>
                        <span>{bet.type}</span>
                        <button className="remove-button" onClick={() => handleRemoveBet(index)}>🗑️</button>
                    </div>
                ))}
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
                            <p>Total Bids: {totalBids}</p>
                            <p>Total Bid Points: ₹{totalAmount}</p>
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

export default SinglePanaBulk;
