import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import axios from 'axios';
import BottomNav from '../components/BottomNav';  // Import BottomNav for consistent bottom navigation
import '../styles/MyBids.css'; // Custom styles for MyBids

const MyBids = () => {
    const [balance, setBalance] = useState(0);  // State for balance
    const [loading, setLoading] = useState(true);  // Loading state for balance
    const navigate = useNavigate();  // To navigate between pages

    // Fetch the user's wallet balance
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const user_id = localStorage.getItem('user_id');  // Retrieve user_id from localStorage
                if (user_id) {
                    const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', { user_id });
                    if (response.data.success) {
                        setBalance(response.data.balance);  // Set the balance state
                    } else {
                        console.error('Error fetching balance:', response.data.message);
                    }
                }
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                setLoading(false);  // Stop loading state once data is fetched
            }
        };

        fetchBalance();
    }, []);  // Empty dependency array ensures this effect runs only once on mount

    return (
        <div className="app"> {/* Wrapping in 'app' class for layout consistency */}
            {/* Header */}
            <div className="my-bids-header">
                <button onClick={() => navigate(-1)} className="back-buttonms">
                    <img src="/assets/back-arrow.png" alt="Back" />
                </button>
                <div className="header-title1">Funds</div>
                <div className="wallet">
                    <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> {/* Custom Wallet Icon */}
                    <span>{loading ? 'Loading...' : balance}</span>  {/* Display the balance */}
                </div>
            </div>

            {/* Content (Bid History Cards) */}
            <div className="content1"> {/* Align content correctly */}
                <div className="bid-history-cards">
                    <div className="bid-card1" onClick={() => navigate('/BidHistory')}>
                        <img src="/assets/bid-history-icon.png" alt="Bid History" className="card-icon" />  {/* Custom Icon */}
                        <div className="card-content">
                            <div className="card-title">Bid History</div>
                            <div className="card-description">You can view your market bid history</div>
                        </div>
                    </div>

                    <div className="bid-card1" onClick={() => navigate('/SartBidHistory')}>
                        <img src="/assets/starline-icon.png" alt="Starline History" className="card-icon" />  {/* Custom Icon */}
                        <div className="card-content">
                            <div className="card-title">Mira Starline Bid History</div>
                            <div className="card-description">You can view your starline bid history</div>
                        </div>
                    </div>

                    <div className="bid-card1" onClick={() => navigate('/JackBidHistory')}>
                        <img src="/assets/jackpot-icon.png" alt="Jackpot History" className="card-icon" />  {/* Custom Icon */}
                        <div className="card-content">
                            <div className="card-title">Mira Jackpot Bid History</div>
                            <div className="card-description">You can view your jackpot bid history</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />  {/* Place BottomNav at the bottom */}
        </div>
    );
};

export default MyBids;
