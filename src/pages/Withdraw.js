import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Withdraw.css'; // Create a matching CSS file for styling
import { useNavigate } from 'react-router-dom';

const Withdraw = () => {
    const [balance, setBalance] = useState(0);
    const [points, setPoints] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch current user balance
        const fetchBalance = async () => {
            try {
                const userId = localStorage.getItem('user_id'); // Assuming user ID is stored in localStorage
                const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id: userId });
                setBalance(response.data.balance);
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();
    }, []);

    const handleWithdraw = async () => {
        if (!points || parseFloat(points) <= 0) {
            alert('Please enter a valid amount.');
            return;
        }

        if (parseFloat(points) > balance) {
            alert('Insufficient balance.');
            return;
        }

        const payload = {
            user_id: localStorage.getItem('user_id'),
            amount: points,
            type: 'withdraw',
            message: 'Withdrawn from Wallet balance',
        };

        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/withdrawFunds.php', payload);
            if (response.data.success) {
                alert('Withdraw request submitted successfully.');
                setBalance((prev) => prev - parseFloat(points));
                setPoints('');
            } else {
                alert(response.data.message || 'Failed to process the withdrawal.');
            }
        } catch (error) {
            console.error('Error submitting withdraw request:', error);
        }
    };

    return (
        <div className="withdraw-container">
            <div className="header">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h2>Withdraw Funds</h2>
            </div>
            <div className="balance-section">
                <div className="wallet-icon-container">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" />
                </div>
                <div>
                    <h3>{balance}</h3>
                    <p>Current Balance</p>
                </div>
            </div>
            <div className="info-section">
                <p>Call or WhatsApp for withdraw related queries</p>
                <p>Monday to Sunday (Timing 10:00 Am to 10:00 Pm)</p>
            </div>
            <div className="input-section">
                <input
                    type="text"
                    placeholder="Enter Points"
                    value={points}
                    onChange={(e) => setPoints(e.target.value.replace(/[^0-9.]/g, ''))}
                />
            </div>
            <button className="withdraw-button" onClick={handleWithdraw}>
                Request Withdraw
            </button>
        </div>
    );
};

export default Withdraw;
