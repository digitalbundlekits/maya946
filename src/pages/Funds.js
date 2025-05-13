import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Funds.css'; // Ensure you create a corresponding CSS file for styling

const Funds = () => {
    const [balance, setBalance] = useState(0);  // State to hold the user's balance
    const navigate = useNavigate();  // React Router navigation

    // Fetch balance when the component mounts
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const user_id = localStorage.getItem('user_id'); // Get user_id from localStorage
                if (user_id) {
                    const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id });
                    if (response.data.success) {
                        setBalance(response.data.balance);  // Set the balance
                    } else {
                        console.error('Error fetching balance:', response.data.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            }
        };
        fetchBalance();  // Call the function to fetch balance
    }, []);  // Empty dependency array ensures this effect runs only once on mount

    return (
        <div className="funds-container">
            {/* Header */}
            <div className="funds-header">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <div className="header-title">Funds</div>
                <div className="wallet-info">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> {/* Custom wallet icon */}
                    <span>{balance}</span>  {/* Display the user's balance */}
                </div>
            </div>

            {/* Fund Options */}
            <div className="funds-options">
                <div className="fund-option" onClick={() => navigate('/deposit')}>
                    <img src="/assets/add_round.png" alt="Add Fund" className="option-icon" /> {/* Custom Icon */}
                    <div className="option-details">
                        <div className="option-title">Add Fund</div>
                        <div className="option-description">You can add fund to your wallet</div>
                    </div>
                </div>

                <div className="fund-option" onClick={() => navigate('/withdraw')}>
                    <img src="/assets/withdraw_hand.png" alt="Withdraw Fund" className="option-icon" /> {/* Custom Icon */}
                    <div className="option-details">
                        <div className="option-title">Withdraw Fund</div>
                        <div className="option-description">You can withdraw winnings</div>
                    </div>
                </div>

                <div className="fund-option" onClick={() => navigate('/bankDetails')}>
                    <img src="/assets/withdraw_scroll.png" alt="Add Bank Details" className="option-icon" /> {/* Custom Icon */}
                    <div className="option-details">
                        <div className="option-title">Add Bank Details</div>
                        <div className="option-description">You can add your bank details</div>
                    </div>
                </div>

                <div className="fund-option" onClick={() => navigate('/depositHistory')}>
                    <img src="/assets/fund_clock.png" alt="Fund Deposit History" className="option-icon" /> {/* Custom Icon */}
                    <div className="option-details">
                        <div className="option-title">Fund Deposit History</div>
                        <div className="option-description">You can see history of your deposit</div>
                    </div>
                </div>

                <div className="fund-option" onClick={() => navigate('/withdrawHistory')}>
                    <img src="/assets/withdraw_scroll.png" alt="Fund Withdraw History" className="option-icon" /> {/* Custom Icon */}
                    <div className="option-details">
                        <div className="option-title">Fund Withdraw History</div>
                        <div className="option-description">You can see history of your fund withdrawals</div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation (Optional) */}
        </div>
    );
};

export default Funds;
