import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate
import axios from 'axios'; // Import axios
import Header from '../components/Header';
import MarketList from '../components/MarketList';
import BottomNav from '../components/BottomNav';
import '../styles/Home.css';
import { FaWhatsapp } from 'react-icons/fa'; // Importing WhatsApp icon

const Home = () => {
    const navigate = useNavigate();
    const [marqueeText, setMarqueeText] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get('https://bhoom.miramatka.com/api/getSiteSettings.php');
                if (response.data.success) {
                    setMarqueeText(response.data.settings.marquee_text);
                    setWhatsappNumber(response.data.settings.whats_app);
                } else {
                    console.error('Error fetching site settings:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const goToStarline = () => {
        navigate('/starline');
    };

    const goToJackpot = () => {
        navigate('/jackpot');
    };

    return (
        <div className="home">
            <Header title="Sara777" />
            {/* Marquee Section */}
            <div className="marquee-container">
                <div className="marquee-content">
                    {marqueeText}
                </div>
            </div>
            {/* WhatsApp Section */}
            <div className="contact-section">
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-link"
                >
                    <FaWhatsapp className="whatsapp-icon" />
                    <span className="whatsapp-number">{whatsappNumber}</span>
                </a>
            </div>
            {/* Buttons Section */}
            <div className="button-section">
                <button className="main-button" onClick={goToStarline}>
                    <span className="play-icon">▶</span>Mira Starline
                </button>
                <button className="main-button" onClick={goToJackpot}>
                    <span className="play-icon">▶</span>Mira Jackpot
                </button>
            </div>
            {/* Market List Section */}
            <div className="market-list">
                <MarketList />
            </div>
            <BottomNav />
        </div>
    );
};

export default Home;
