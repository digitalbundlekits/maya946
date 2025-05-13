import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { setLoginSession, getLoginSession } from '../utils/storage'; // Import Capacitor Storage utilities

const LoginPage = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // Button loading state
    const navigate = useNavigate();

    const resetError = () => setError('');

    // Save session on the server
    const saveSession = async (userId) => {
        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/saveSession.php', {
                user_id: userId,
            });
            if (response.data.success) {
                await setLoginSession(userId, response.data.session_id); // Save session using Capacitor Storage
                return true;
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(`Failed to save session: ${err.message}`);
            console.error('Save session error:', err);
            return false;
        }
    };

    // Auto-login if session exists
    const autoLogin = useCallback(async () => {
        const { sessionId } = await getLoginSession(); // Only use sessionId since userId is not needed
        if (sessionId) {
            try {
                const response = await axios.post('https://bhoom.miramatka.com/api/validateSession.php', {
                    session_id: sessionId,
                });

                if (response.data.success) {
                    console.log('Auto-login successful');
                    navigate('/home');
                }
            } catch (err) {
                console.error('Auto-login failed:', err);
            }
        }
    }, [navigate]);

    // Trigger auto-login on component mount
    useEffect(() => {
        autoLogin();
    }, [autoLogin]);

    // Handle login with phone and password
    const handleLogin = async () => {
        resetError();
        setLoading(true);
        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/loginApi.php', {
                phone,
                password,
            });

            if (response.data.success) {
                const sessionSaved = await saveSession(response.data.user_id);
                if (sessionSaved) {
                    navigate('/home');
                }
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(`Login failed: ${err.message}`);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP request
    const handleSendOtp = async () => {
        resetError();
        setLoading(true);
        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/sendOtpForLogin.php', { phone });

            if (response.data.success) {
                setOtpSent(true);
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(`Failed to send OTP: ${err.message}`);
            console.error('Send OTP error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle login with OTP
    const handleLoginWithOtp = async () => {
        resetError();
        setLoading(true);
        try {
            const response = await axios.post('https://bhoom.miramatka.com/api/loginWithOtpApi.php', {
                phone,
                otp,
            });

            if (response.data.success) {
                const sessionSaved = await saveSession(response.data.user_id);
                if (sessionSaved) {
                    navigate('/home');
                }
            } else {
                throw new Error(response.data.message);
            }
        } catch (err) {
            setError(`OTP login failed: ${err.message}`);
            console.error('Login with OTP error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <img src="/assets/logo.png" alt="Logo" className="logo2" />
            <h2>Enter Your Mobile Number</h2>
            <div className="input-field">
                <span className="icon">&#128241;</span>
                <input
                    type="text"
                    placeholder="Enter your mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
            {!otpSent && (
                <>
                    <div className="input-field">
                        <span className="icon">&#128274;</span>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button className="login-btn" onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging in...' : 'LOGIN'}
                    </button>
                    <button className="login-btn" onClick={handleSendOtp} disabled={loading}>
                        {loading ? 'Sending OTP...' : 'LOGIN WITH OTP'}
                    </button>
                </>
            )}
            {otpSent && (
                <>
                    <div className="input-field">
                        <span className="icon">&#128241;</span>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button className="login-btn" onClick={handleLoginWithOtp} disabled={loading}>
                        {loading ? 'Verifying...' : 'VERIFY OTP AND LOGIN'}
                    </button>
                </>
            )}
            <button className="register-btn" onClick={() => navigate('/register')}>REGISTER</button>
        </div>
    );
};

export default LoginPage;
