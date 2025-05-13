import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';
import { Preferences } from '@capacitor/preferences';

const Header = () => {
  const [user, setUser] = useState({ name: '', phone: '', balance: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userIdResult = await Preferences.get({ key: 'user_id' });
        const user_id = userIdResult.value;

        console.log('User ID from Preferences:', user_id);

        if (user_id) {
          console.log('Starting API call to getUserData...');
          const response = await axios.post(
            'https://bhoom.miramatka.com/api/getUserData.php',
            { user_id },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log('API Response:', response.data);

          if (response.data.success) {
            setUser({
              name: response.data.name,
              phone: response.data.phone,
              balance: response.data.balance,
            });
          } else {
            console.error('API Error:', response.data.message);
          }
        } else {
          console.warn('User ID not found in Preferences.');
        }
      } catch (error) {
        if (error.response) {
          console.error('Server responded with a status:', error.response.status);
          console.error('Response data:', error.response.data);
        } else if (error.request) {
          console.error('No response received from server:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear Capacitor Preferences
      await Preferences.remove({ key: 'user_id' });
      
      // Clear localStorage
      localStorage.clear();
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleMenuClick = (path) => {
    if (path === '/logout') {
      handleLogout();
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="header1">
      <div className="header-left">
        <span
          className="menu-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          tabIndex="0"
          role="button"
          aria-label="Toggle Menu"
        >
          &#9776;
        </span>
        <img src="/assets/logo.png" alt="Mira Matka Logo" className="logo" />
      </div>

      <div className="header-right">
        <div className="wallet-icon1">
          <img src="/assets/wallet-icon.png" alt="Wallet Icon" />
        </div>
        <span className="balance1">₹{user.balance}</span>
      </div>

      {isMenuOpen && (
        <>
          <div
            className={`sidebar ${isMenuOpen ? 'open' : ''}`}
            aria-hidden={!isMenuOpen}
          >
            <div className="user-info">
              <img src="/assets/man.png" alt="User" className="user-icon" />
              <span className="user-name">{user.name}</span>
              <span className="user-phone">{user.phone}</span>
            </div>
            <ul className="menu-list">
              <li onClick={() => handleMenuClick('/home')}>
                <img src="/assets/home_nav.png" alt="Home" />
                Home
              </li>
              <li onClick={() => handleMenuClick('/mybids')}>
                <img src="/assets/bid_nav.png" alt="My Bids" />
                My Bids
              </li>
              <li onClick={() => handleMenuClick('/passbook')}>
                <img src="/assets/passbook.png" alt="Passbook" />
                Passbook
              </li>
              <li onClick={() => handleMenuClick('/funds')}>
                <img src="/assets/funds_nav.png" alt="Funds" />
                Funds
              </li>
              <li onClick={() => handleMenuClick('/charts')}>
                <img src="/assets/charts.png" alt="Charts" />
                Charts
              </li>
              <li onClick={() => handleMenuClick('/download-app')}>
                <img src="/assets/cell-phone.png" alt="Download App" />
                Download App
              </li>
              <li onClick={() => handleMenuClick('/logout')}>
                <img src="/assets/logout_icon.png" alt="Logout" />
                Logout Account
              </li>
            </ul>
          </div>
          <div
            className={`sidebar-backdrop ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default Header;