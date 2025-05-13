import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/BottomNav.css'; // Import the CSS styles

const BottomNav = () => {
    const navigate = useNavigate(); // For navigation
    const whatsappPhoneNumber = '8558848999'; // Ensure this is the correct number with country code
    const whatsappMessage = encodeURIComponent('Hello, I need support.'); // Customize your default message
    const whatsappLink = `https://wa.me/${whatsappPhoneNumber}?text=${whatsappMessage}`;

    // Handler for WhatsApp support
    const handleSupportClick = () => {
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bottom-nav">
            {/* Navigation Item: My Bids */}
            <div className="nav-item" onClick={() => navigate('/mybids')}>
                <img src="/assets/bids.png" alt="My Bids" className="nav-icon" />
                <span>My Bids</span>
            </div>
            {/* Navigation Item: Passbook */}
            <div className="nav-item" onClick={() => navigate('/passbook')}>
                <img src="/assets/passbook.png" alt="Passbook" className="nav-icon" />
                <span>Passbook</span>
            </div>
            {/* Navigation Item: Home */}
            <div className="nav-item home-icon" onClick={() => navigate('/home')}>
                <img src="/assets/home.png" alt="Home" className="nav-icon large-icon" />
            </div>
            {/* Navigation Item: Funds */}
            <div className="nav-item" onClick={() => navigate('/funds')}>
                <img src="/assets/funds.png" alt="Funds" className="nav-icon" />
                <span>Funds</span>
            </div>
             {/* Navigation Item: Support */}
             <div className="nav-item" onClick={handleSupportClick}>
                <img src="/assets/support.png" alt="Support" className="nav-icon" />
                <span>Support</span>
            </div>
        </div>
    );
};

export default BottomNav;

