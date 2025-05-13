import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const GroupJodi = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [inputDigit, setInputDigit] = useState('');
    const [points, setPoints] = useState('');
    const [bets, setBets] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const { marketName } = useParams();
    const { state } = useLocation();
    const marketId = state?.marketId || 1; // Default to 1 if market ID not provided in state

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const userId = localStorage.getItem('user_id');
                const response = await fetch('https://bhoom.miramatka.com/api/getBalanceApi.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_id: userId })
                });
                const data = await response.json();
                if (data) {
                    setBalance(data.balance);
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();
    }, []);

    // Group numbers for each row
    const groupNumbers = {
        '00': ["00", "05", "50", "55"],
'01': ["10", "15", "51", "56", "60", "65", "01", "06"],
'02': ["20", "25", "52", "57", "70", "75", "02", "07"],
'03': ["30", "35", "53", "58", "80", "85", "03", "08"],
'04': ["40", "45", "54", "59", "90", "95", "04", "09"],
'05': ["50", "55", "05", "00"],
'06': ["51", "56", "06", "01", "15", "10", "65", "60"],
'07': ["52", "57", "07", "02", "25", "20", "75", "70"],
'08': ["53", "58", "08", "03", "35", "30", "85", "80"],
'09': ["54", "59", "09", "04", "45", "40", "95", "90"],
'10': ["10", "15", "60", "65", "01", "06", "51", "56"],
'11': ["11", "16", "61", "66"],
'12': ["21", "26", "62", "67", "71", "76", "12", "17"],
'13': ["31", "36", "63", "68", "81", "86", "13", "18"],
'14': ["41", "46", "64", "69", "91", "96", "14", "19"],
'15': ["60", "65", "15", "10", "06", "01", "56", "51"],
'16': ["61", "66", "16", "11"],
'17': ["62", "67", "17", "12", "26", "21", "76", "71"],
'18': ["63", "68", "18", "13", "36", "31", "86", "81"],
'19': ["64", "69", "19", "14", "46", "41", "96", "91"],
'20': ["20", "25", "70", "75", "02", "07", "52", "57"],
'21': ["21", "26", "71", "76", "12", "17", "62", "67"],
'22': ["22", "27", "72", "77"],
'23': ["32", "37", "73", "78", "82", "87", "23", "28"],
'24': ["42", "47", "74", "79", "92", "97", "24", "29"],
'25': ["70", "75", "25", "20", "07", "02", "57", "52"],
'26': ["71", "76", "26", "21", "17", "12", "67", "62"],
'27': ["72", "77", "27", "22"],
'28': ["73", "78", "28", "23", "37", "32", "87", "82"],
'29': ["74", "79", "29", "24", "47", "42", "97", "92"],
'30': ["30", "35", "80", "85", "03", "08", "53", "58"],
'31': ["31", "36", "81", "86", "13", "18", "63", "68"],
'32': ["32", "37", "82", "87", "23", "28", "73", "78"],
'33': ["33", "38", "83", "88"],
'34': ["43", "48", "84", "89", "93", "98", "34", "39"],
'35': ["80", "85", "35", "30", "08", "03", "58", "53"],
'36': ["81", "86", "36", "31", "18", "13", "68", "63"],
'37': ["82", "87", "37", "32", "28", "23", "78", "73"],
'38': ["83", "88", "38", "33"],
'39': ["84", "89", "39", "34", "48", "43", "98", "93"],
'40': ["40", "45", "90", "95", "04", "09", "54", "59"],
'41': ["41", "46", "91", "96", "14", "19", "64", "69"],
'42': ["42", "47", "92", "97", "24", "29", "74", "79"],
'43': ["43", "48", "93", "98", "34", "39", "84", "89"],
'44': ["44", "49", "94", "99"],
'45': ["90", "95", "45", "40", "09", "04", "59", "54"],
'46': ["91", "96", "46", "41", "19", "14", "69", "64"],
'47': ["92", "97", "47", "42", "29", "24", "79", "74"],
'48': ["93", "98", "48", "43", "39", "34", "89", "84"],
'49': ["94", "99", "49", "44"],
'50': ["50", "55", "00", "05"],
'51': ["51", "56", "01", "06", "10", "15", "60", "65"],
'52': ["52", "57", "02", "07", "20", "25", "70", "75"],
'53': ["53", "58", "03", "08", "30", "35", "80", "85"],
'54': ["54", "59", "04", "09", "40", "45", "90", "95"],
'55': ["55", "50", "05", "00"],
'56': ["56", "51", "06", "01", "15", "10", "65", "60"],
'57': ["57", "52", "07", "02", "25", "20", "75", "70"],
'58': ["58", "53", "08", "03", "35", "30", "85", "80"],
'59': ["59", "54", "09", "04", "45", "40", "95", "90"],
'60': ["60", "65", "10", "15", "51", "56", "01", "06"],
'61': ["61", "66", "11", "16"],
'62': ["62", "67", "12", "17", "21", "26", "71", "76"],
'63': ["63", "68", "13", "18", "31", "36", "81", "86"],
'64': ["64", "69", "14", "19", "41", "46", "91", "96"],
'65': ["65", "60", "15", "10", "01", "56", "51", "06" ],
'66': ["66", "61", "16", "11"],
'67': ["67", "62", "17", "12", "26", "21", "76", "71"],
'68': ["68", "63", "18", "13", "36", "31", "86", "81"],
'69': ["69", "64", "19", "14", "46", "41", "96", "91"],
'70': ["70", "75", "20", "25", "52", "57", "02", "07"],
'71': ["71", "76", "21", "26", "12", "17", "62", "67"],
'72': ["72", "77", "22", "27"],
'73': ["73", "78", "23", "28", "32", "37", "82", "87"],
'74': ["74", "79", "24", "29", "42", "47", "92", "97"],
'75': ["75", "70", "25", "20", "02", "07", "52", "57"],
'76': ["76", "71", "26", "21", "17", "12", "67", "62"],
'77': ["77", "72", "27", "22"],
'78': ["78", "73", "28", "23", "37", "32", "87", "82"],
'79': ["79", "74", "29", "24", "47", "42", "97", "92"],
'80': ["80", "85", "30", "35", "53", "58", "03", "08"],
'81': ["81", "86", "31", "36", "13", "18", "63", "68"],
'82': ["82", "87", "32", "37", "23", "28", "73", "78"],
'83': ["83", "88", "33", "38"],
'84': ["84", "89", "34", "39", "43", "48", "93", "98"],
'85': ["85", "80", "35", "30", "03", "08", "53", "58"],
'86': ["86", "81", "36", "31", "18", "13", "68", "63"],
'87': ["87", "82", "37", "32", "28", "23", "78", "73"],
'88': ["88", "83", "38", "33"],
'89': ["89", "84", "39", "34", "48", "43", "98", "93"],
'90': ["90", "95", "40", "45", "54", "59", "04", "09"],
'91': ["91", "96", "41", "46", "14", "19", "64", "69"],
'92': ["92", "97", "42", "47", "24", "29", "74", "79"],
'93': ["93", "98", "43", "48", "34", "39", "84", "89"],
'94': ["94", "99", "44", "49"],
'95': ["95", "90", "45", "40", "04", "09", "54", "59"],
'96': ["96", "91", "46", "41", "19", "14", "69", "64"],
'97': ["97", "92", "47", "42", "29", "24", "79", "74"],
'98': ["98", "93", "48", "43", "39", "34", "89", "84"],
'99': ["99", "94", "49", "44"]
    };

    const getMarketAndGameType = () => {
        const marketId = window.marketId || 1; // Ensure we have a default market ID
        
        if (window.marketName === 'Mira Starline') {
            return { table: 'sbids', marketIdField: 'starline', marketId, gameTypeId: 17 };
        }
        if (window.marketName === 'Mira Jackpot') {
            return { table: 'jbids', marketIdField: 'jackpot', marketId, gameTypeId: 17 };
        }
        return { table: 'bids', marketIdField: 'market', marketId, gameTypeId: 17 };
    };

    const handleDigitInputChange = (value) => {
        // Allow only numbers and limit to 2 digits
        const sanitizedValue = value.replace(/[^0-9]/g, '').slice(0, 2);
        setInputDigit(sanitizedValue);
    };

    const handleAddBet = () => {
        if (!inputDigit || !points || !groupNumbers[inputDigit]) {
            alert('Please enter a valid number (00-99) and points!');
            return;
        }

        // Get all numbers for the selected row
        const rowNumbers = groupNumbers[inputDigit];

        // Create bets for all numbers in the row
        const newBets = rowNumbers.map((digit) => ({
            digit,
            points: parseInt(points, 10),
            type: 'close',
        }));

        setBets((prevBets) => [...prevBets, ...newBets]);
        setInputDigit('');
        setPoints('');
    };

    const handleRemoveBet = (index) => {
        setBets((prevBets) => prevBets.filter((_, i) => i !== index));
    };

    const calculateTotalPoints = () => bets.reduce((sum, bet) => sum + bet.points, 0);

    const confirmSubmit = async () => {
        const { table, marketIdField, gameTypeId } = getMarketAndGameType();
        const payload = {
            user_id: localStorage.getItem('user_id'),
            game_type: gameTypeId,
            type: 'close',
            market_table: table,
            market_id_field: marketIdField,
            market_id: marketId,  // Using marketId from state
            bids: bets,
            totalAmount: calculateTotalPoints(),
            userbalance: balance - calculateTotalPoints(),
            message: `${marketName ? marketName.toUpperCase() : 'UNKNOWN'} GROUP JODI`,
        };

        try {
            const response = await fetch('https://bhoom.miramatka.com/api/placeBet.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (data.success) {
                setBalance((prevBalance) => prevBalance - calculateTotalPoints());
                setBets([]);
                setShowReviewModal(false);
            } else {
                console.error('Error submitting bets:', data.message);
                alert(data.message || 'Error placing bets');
            }
        } catch (error) {
            console.error('Error submitting bets:', error);
            alert('Failed to submit bets');
        }
    };

    return (
        <div className="group-jodi-container">
            <div className="headergj">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h2>{marketName ? marketName.toUpperCase() : 'UNKNOWN'}, GROUP JODI</h2>
                <div className="balancemn">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> ₹{balance}
                </div>
            </div>

            <div className="inputs">
                <div className="input-group">
                    <label>Enter Number:</label>
                    <input
                        type="text"
                        value={inputDigit}
                        onChange={(e) => handleDigitInputChange(e.target.value)}
                        placeholder="Enter number (00-99)"
                        maxLength={2}
                    />
                </div>

                <div className="input-group">
                    <label>Enter Points:</label>
                    <input
                        type="number"
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        placeholder="Enter points"
                        min="1"
                    />
                </div>

                <button className="add-bid-button" onClick={handleAddBet}>
                    ADD BID
                </button>
            </div>

            <table className="bids-table">
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Points</th>
                        <th>Type</th>
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
                                <button className="delete-button" onClick={() => handleRemoveBet(index)}>
                                    🗑
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
                                    <th>Number</th>
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

export default GroupJodi;