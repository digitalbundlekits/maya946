import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

const OTPPopup = ({ phone, name, password, mpin, referralBy, otp, setOtp, onVerifySuccess, onClose }) => {
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleVerifyOtp = async () => {
        setError('');
        setSuccessMessage('');
        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/registerApi.php', {
                phone,
                otp,
                name,
                password,
                mpin,
                referralby: referralBy,
            });

            if (response.data.success) {
                setSuccessMessage('OTP verified successfully!');
                setTimeout(() => {
                    onVerifySuccess();
                }, 1000);
            } else {
                setError(response.data.message);
            }
        } catch {
            setError('An error occurred while verifying the OTP.');
        }
    };

    return (
        <div className="otp-popup-overlay">
            <div className="otp-popup">
                <h3>Verify OTP</h3>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                {error && <div className="error">{error}</div>}
                {successMessage && <div className="success">{successMessage}</div>}
                <button className="verify-btn" onClick={handleVerifyOtp}>
                    Verify OTP
                </button>
                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [mpin, setMpin] = useState('');
    const [referralBy, setReferralBy] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        setError('');
        setSuccessMessage('');

        if (!name || !password || !/^\d{10}$/.test(phone) || !/^\d{4}$/.test(mpin)) {
            setError('Please enter valid name, password, phone number, and MPIN.');
            return;
        }

        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/sendOtp.php', { phone });

            if (response.data.success) {
                setSuccessMessage('OTP sent successfully!');
                setOtpSent(true);
            } else {
                setError(response.data.message);
            }
        } catch {
            setError('An error occurred while sending the OTP.');
        }
    };

    const handleVerifySuccess = async () => {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
    };

    return (
        <div className="register-container">
            <img src="/assets/logo.png" alt="Logo" className="logo1" />
            <div class="center-container">
    <h2>Register Your Account</h2>
</div>
            <div className="input-field">
                <span className="icon">👤</span>
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="input-field">
                <span className="icon">📱</span>
                <input
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            <div className="input-field">
                <span className="icon">🔒</span>
                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="input-field">
                <span className="icon">🔢</span>
                <input
                    type="text"
                    maxLength="4"
                    placeholder="Enter 4-Digit MPIN"
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                />
            </div>
            <div className="input-field">
                <span className="icon">🎁</span>
                <input
                    type="text"
                    placeholder="Enter Referral Code (optional)"
                    value={referralBy}
                    onChange={(e) => setReferralBy(e.target.value)}
                />
            </div>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            {!otpSent && (
                <button className="login-link" onClick={handleSendOtp}>
                    Send OTP
                </button>
            )}
            {otpSent && (
                <OTPPopup
                    phone={phone}
                    name={name}
                    password={password}
                    mpin={mpin}
                    referralBy={referralBy}
                    otp={otp}
                    setOtp={setOtp}
                    onVerifySuccess={handleVerifySuccess}
                    onClose={() => setOtpSent(false)}
                />
            )}
            <button className="login-link" onClick={() => navigate('/login')}>
                ALREADY HAVE AN ACCOUNT
            </button>
        </div>
    );
};

export default RegisterPage;
