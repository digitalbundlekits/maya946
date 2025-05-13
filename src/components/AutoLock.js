// src/components/AutoLock.js
import React, { useState, useEffect } from 'react';
import '../styles/MpinLock.css';

const AutoLock = ({ userId, initialLock, onUnlock, onLock }) => {
  const [isLocked, setIsLocked] = useState(initialLock);
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newMpin, setNewMpin] = useState(['', '', '', '']);
  const [isForgotMpin, setIsForgotMpin] = useState(false);

  useEffect(() => {
    // Update isLocked state based on initialLock prop
    setIsLocked(initialLock);
  }, [initialLock]);

  useEffect(() => {
    if (isLocked) {
      const setLocalStorage = (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error(`Error setting localStorage for "${key}":`, error);
        }
      };

      let timer;
      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          console.log('User inactive for 1 minute. Locking the screen.');
          setIsLocked(true);
          onLock(); // Notify App to lock the screen
          setLocalStorage('isLocked', 'true');
        }, 10000); // Lock screen after 1 minute of inactivity
      };

      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      resetTimer(); // Initialize timer

      return () => {
        clearTimeout(timer);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keydown', resetTimer);
      };
    }
  }, [isLocked, onLock]);

  // Handle MPIN unlock
  const handleUnlock = async () => {
    const enteredMpin = mpin.join('');
    setError(''); // Clear previous errors
    console.log('Attempting to unlock with MPIN:', enteredMpin);
    try {
      const response = await fetch('https://bhoom.miramatka.com/api/verifyMpin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, mpin: enteredMpin }),
      });
      const data = await response.json();
      console.log('MPIN verification response:', data);
      if (data.success) {
        setMpin(['', '', '', '']);
        setError('');
        localStorage.setItem('isLocked', 'false');
        setIsLocked(false);
        onUnlock(); // Notify App to unlock
      } else {
        setError('Invalid MPIN. Please try again.');
      }
    } catch (error) {
      console.error('Error during MPIN verification:', error);
      setError('An error occurred. Please try again.');
    }
  };

  // Handle OTP sending
  const sendOtp = async () => {
    try {
      const response = await fetch('https://bhoom.miramatka.com/api/sendOtpForMpin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (data.success) {
        alert('OTP sent successfully');
      } else {
        alert(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    }
  };

  // Handle MPIN reset
  const resetMpin = async () => {
    const enteredNewMpin = newMpin.join('');
    try {
      const response = await fetch('https://bhoom.miramatka.com/api/verifyOtpForMpin.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newMpin: enteredNewMpin }),
      });
      const data = await response.json();
      if (data.success) {
        alert('MPIN reset successfully.');
        setIsForgotMpin(false);
        setNewMpin(['', '', '', '']);
      } else {
        setError(data.message || 'Failed to reset MPIN.');
      }
    } catch (error) {
      console.error('Error resetting MPIN:', error);
      setError('An error occurred. Please try again.');
    }
  };

  // Handle input changes for MPIN
  const handleInputChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits
    const updatedMpin = [...mpin];
    updatedMpin[index] = value;
    setMpin(updatedMpin);

    if (value && index < mpin.length - 1) {
      document.getElementById(`mpin-input-${index + 1}`).focus();
    }
  };

  // Handle backspace navigation
  const handleBackspace = (event, index) => {
    if (event.key === 'Backspace' && mpin[index] === '' && index > 0) {
      document.getElementById(`mpin-input-${index - 1}`).focus();
    }
  };

  // Render Forgot MPIN screen
  if (isForgotMpin) {
    return (
      <div className="forgot-mpin-screen">
        <div className="forgot-mpin-container">
          <h3>Reset MPIN</h3>
          <input
            type="text"
            placeholder="Enter Phone Number"
            className="forgot-mpin-input1"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button className="send-otp-btn" onClick={sendOtp}>
            Send OTP
          </button>
          <input
            type="text"
            placeholder="Enter OTP"
            className="forgot-mpin-input1"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <h3>Enter New MPIN</h3>
          <div className="new-mpin-input-container">
            {newMpin.map((digit, index) => (
              <input
                key={index}
                id={`new-mpin-input-${index}`}
                type="password"
                maxLength="1"
                className="mpin-input"
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
              />
            ))}
          </div>
          <button className="reset-mpin-btn" onClick={resetMpin}>
            Reset MPIN
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    );
  }

  // Render Locked state screen
  if (isLocked) {
    return (
      <div className="lock-screen">
        <div className="mpin-container">
          <h3>Enter MPIN</h3>
          <p>Unlock your account</p>
          <div className="mpin-input-container">
            {mpin.map((digit, index) => (
              <input
                key={index}
                id={`mpin-input-${index}`}
                type="password"
                maxLength="1"
                value={digit}
                className="mpin-input"
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
              />
            ))}
          </div>
          {error && <p className="error">{error}</p>}
          <button className="mpin-submit-btn" onClick={handleUnlock}>
            Unlock
          </button>
          <button className="mpin-submit-btn" onClick={() => setIsForgotMpin(true)}>
            Forgot MPIN?
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AutoLock;
