import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DoublePanaBulk.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const DoublePanaBulk = () => {
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState('');
    const [bets, setBets] = useState([]);
    const gameType = 'CLOSE'; // Always CLOSE
    const navigate = useNavigate();
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1;

    const doublePanaNumbers = {
        0: ["677", "668", "550", "488", "334", "299", "244", "226", "118"],
        1: ["100", "119", "155", "227", "335", "344", "399", "588", "669"],
        2: ["110", "200", "228", "255", "336", "499", "660", "688", "778"],
        3: ["166", "229", "300", "337", "355", "455", "599", "779", "788"],
        4: ["112", "220", "266", "338", "400", "446", "455", "699", "770"],
        5: ["113", "122", "177", "339", "366", "447", "500", "799", "889"],
        6: ["600", "114", "277", "330", "448", "466", "556", "880", "899"],
        7: ["115", "133", "188", "223", "377", "449", "557", "566", "700"],
        8: ["116", "224", "233", "288", "440", "477", "558", "800", "990"],
        9: ["117", "144", "199", "225", "388", "559", "577", "667", "900"]
    };

    const getMarketAndGameType = () => {
        if (marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', gameTypeId: 14 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', gameTypeId: 14 };
        }
        return { table: 'bids', marketIdField: 'market', gameTypeId: 14 };
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
            const rowBets = doublePanaNumbers[row].map(number => ({
                digit: number,
                points: parseInt(points, 10),
                type: gameType
            }));
            setBets(prevBets => [...prevBets, ...rowBets]);
        }
    };

    const handleRemoveBet = (index) => {
        setBets(bets.filter((_, i) => i !== index));
    };

    const totalBids = bets.length;
    const totalAmount = bets.reduce((sum, bet) => sum + bet.points, 0);

    const confirmSubmit = async () => {
        const { table, marketIdField, gameTypeId } = getMarketAndGameType();
        const payload = {
            user_id: localStorage.getItem('user_id'),
            game_type: gameTypeId,
            type: gameType.toLowerCase(),
            market_table: table,
            market_id_field: marketIdField,
            market_id: marketId,
            bids: bets,
            totalAmount,
            userbalance: balance - totalAmount,
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} DOUBLE PANNA BULK`,
        };

        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/placeBet.php', payload);
            if (response.data.success) {
                setBalance(prevBalance => prevBalance - totalAmount);
                setBets([]);
                setPoints('');
            } else {
                console.error('Error submitting bet:', response.data.message);
            }
        } catch (error) {
            console.error('Error submitting bet:', error);
        }
    };

    return (
        <div className="double-pana-bulk-container">
            <div className="headerdpb">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, DOUBLE PANNA BULK</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            {/* Game type selection removed completely */}

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
                {[...Array(10).keys()].map(num => (
                    <button key={num} className="row-button" onClick={() => placeBetForRow(num)} disabled={!points}>
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
                        <button className="remove-button" onClick={() => handleRemoveBet(index)}>
                            🗑️
                        </button>
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

export default DoublePanaBulk;
