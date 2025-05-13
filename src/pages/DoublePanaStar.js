import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DoublePana.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const DoublePana = () => {
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState({});
    const [selectedRow, setSelectedRow] = useState(0);
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
            return { table: 'sbids', marketIdField: 'starline', gameTypeId: 13 };
        }
        if (marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', gameTypeId: 13 };
        }
        return { table: 'bids', marketIdField: 'market', gameTypeId: 13 };
    };

    useEffect(() => {
        const fetchBalance = async () => {
            const userId = localStorage.getItem('user_id');
            const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
            setBalance(response.data.balance);
        };
        fetchBalance();
    }, []);

    const handleRowSelect = (row) => {
        setSelectedRow(row);
        if (!points[row]) {
            setPoints(prev => ({ ...prev, [row]: Array(doublePanaNumbers[row].length).fill('') }));
        }
    };

    const handlePointsChange = (digitIndex, value) => {
        const updatedPoints = { ...points };
        updatedPoints[selectedRow][digitIndex] = value.replace(/[^0-9]/g, '');
        setPoints(updatedPoints);
    };

    const totalBids = Object.values(points).flat().filter(amount => amount).length;
    const totalAmount = Object.values(points).flat().reduce((sum, amount) => sum + (parseInt(amount, 10) || 0), 0);

    const confirmSubmit = async () => {
        const allBets = Object.entries(points).flatMap(([row, amounts]) =>
            amounts.map((amount, index) => ({
                digit: doublePanaNumbers[row][index],
                points: parseInt(amount, 10),
                type: gameType
            })).filter(bet => bet.points > 0)
        );

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
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} DOUBLE PANNA`,
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
        <div className="double-pana-container">
            <div className="headergj">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, DOUBLE PANNA</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            {/* Removed game type selector completely */}

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

            <div className="pana-inputs">
                {doublePanaNumbers[selectedRow].map((number, index) => (
                    <div key={index} className="pana-input">
                        <span className="pana-label">{number}</span>
                        <input
                            type="text"
                            placeholder="Enter amount"
                            value={points[selectedRow]?.[index] || ''}
                            onChange={(e) => handlePointsChange(index, e.target.value)}
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

export default DoublePana;