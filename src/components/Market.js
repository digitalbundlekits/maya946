import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Market.css';

// Utility function to format time in 12-hour AM/PM format
const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);

    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'Asia/Kolkata', // Ensure time is shown in Asia/Kolkata timezone
    }).format(date);
};

const Market = ({ marketId, marketName, result, openTime, closeTime, status }) => {
    const navigate = useNavigate();

    const handlePlayNow = () => {
        if (status !== 'closed') {
            navigate(`/gameOptions/${marketName}`, { state: { marketId, marketName } });
        }
    };

    // Ensure result includes placeholders if missing
    const displayResult = result || "***-**-***";

    return (
        <div className="market-card">
            {/* Left Section */}
            <div className="market-info">
                <div className="market-name">{marketName}</div>
                <div className="market-number">{displayResult}</div>
                <div className="market-times">
                    <div className="bid-row">
                        <div className="bid-info">
                            <span>Open Bids:</span>
                            <span className="bid-time">{formatTime(openTime)}</span>
                        </div>
                        <div className="bid-info">
                            <span>Close Bids:</span>
                            <span className="bid-time">{formatTime(closeTime)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="market-action">
                <span className={`market-status ${status === 'closed' ? 'closed' : 'open'}`}>
                    {status === 'closed' ? 'Closed for Today' : 'Betting is Running'}
                </span>
                <button
                    className={`play-btn ${status === 'closed' ? 'disabled' : ''}`}
                    disabled={status === 'closed'}
                    onClick={handlePlayNow}
                >
                    ▶
                </button>
                <span className="play-text">Play Game</span>
            </div>
        </div>
    );
};

export default Market;
