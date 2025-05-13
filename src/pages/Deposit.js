import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Deposit.css';

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [paymentStep, setPaymentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [utrNumber, setUtrNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [upiOptions, setUpiOptions] = useState([]);
  const [selectedUpi, setSelectedUpi] = useState(null);
  const [paymentId, setPaymentId] = useState(null);
  
  const predefinedAmounts = [800, 2000, 6000, 18000, 25000, 40000];
  
  const navigate = useNavigate();
  
  // Get user ID from local storage
  const userId = localStorage.getItem('user_id');
  
  const fetchBalance = useCallback(async () => {
    try {
      const response = await axios.post('https://bhoom.miramatka.com/api/getBalanceApi.php', {
        user_id: userId,
      });
      
      if (response.data.success) {
        setBalance(response.data.balance);
      } else {
        console.error('Failed to fetch balance:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [userId]);

  // Fetch UPI details from backend
  const fetchUpiDetails = useCallback(async () => {
    try {
      const response = await axios.get('https://bhoom.miramatka.com/api/upi_payment.php?endpoint=get_upi');
      
      if (response.data.status === 'success') {
        setUpiOptions(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedUpi(response.data.data[0]);
        }
      } else {
        setStatusMessage('Failed to load UPI details. Please try again.');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error fetching UPI details:', error);
      setStatusMessage('Server error. Please try again later.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  }, []);
  
  useEffect(() => {
    fetchBalance();
    fetchUpiDetails();
  }, [fetchBalance, fetchUpiDetails]);
  
  const handlePredefinedAmountClick = (amt) => {
    setAmount(amt);
  };
  
  const copyUpiId = () => {
    if (selectedUpi && selectedUpi.upi_id) {
      navigator.clipboard.writeText(selectedUpi.upi_id);
      setStatusMessage('UPI ID copied to clipboard');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };
  
  const proceedToPayment = async () => {
    if (amount < 500 || amount > 100000) {
      setStatusMessage('Please enter an amount between ₹500 and ₹100000');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Initialize payment through the new API
      const response = await axios.post('https://bhoom.miramatka.com/api/upi_payment.php?endpoint=initiate_payment', {
        user_id: userId,
        amount: parseFloat(amount)
      });
      
      setIsLoading(false);
      
      if (response.data.status === 'success') {
        setPaymentId(response.data.payment_id);
        setPaymentStep(2);
      } else {
        setStatusMessage(response.data.message || 'Failed to initiate payment');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error initiating payment:', error);
      setStatusMessage('Server error. Please try again later.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };
  
  const handleUpiChange = (e) => {
    const upiId = e.target.value;
    const upi = upiOptions.find(upi => upi.id === parseInt(upiId));
    setSelectedUpi(upi);
  };
  
  const submitManualPayment = async () => {
    // Validate UTR number - must be exactly 12 digits
    if (!utrNumber || !/^\d{12}$/.test(utrNumber)) {
      setStatusMessage('Please enter a valid 12-digit UTR number');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the UTR submission API
      const response = await axios.post('https://bhoom.miramatka.com/api/upi_payment.php?endpoint=submit_utr', {
        payment_id: paymentId,
        utr_number: utrNumber,
        user_id: userId
      });
      
      setIsLoading(false);
      
      if (response.data.status === 'success') {
        setPaymentStep(3);
        // Refresh balance after successful payment request
        fetchBalance();
      } else {
        setStatusMessage(response.data.message || 'Payment request failed. Try again.');
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error submitting payment:', error);
      if (error.response && error.response.data && error.response.data.message) {
        setStatusMessage(error.response.data.message);
      } else {
        setStatusMessage('Network error. Please try again.');
      }
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };
  
  const resetPayment = () => {
    setPaymentStep(1);
    setAmount('');
    setUtrNumber('');
    setStatusMessage('');
    setPaymentId(null);
  };
  
  // Generate UPI payment link
  const getUpiPaymentLink = () => {
    if (!selectedUpi || !selectedUpi.upi_id || !amount) return '#';
    
    const upiId = selectedUpi.upi_id;
    const payeeName = selectedUpi.upi_name;
    const payAmount = parseFloat(amount);
    
    return `upi://pay?pa=${upiId}&pn=${payeeName}&am=${payAmount}&cu=INR`;
  };
  
  return (
    <div className="deposit-container">
      <div className="header">
      <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
        <h2>Recharge</h2>
      </div>
      
      <div className="balance-card">
        <div className="balance-info">
          <p className="balance-label">Current Balance</p>
          <p className="balance-amount">₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
        </div>
      </div>
      
      {statusMessage && (
        <div className="status-message">
          <span className="icon">&#9888;</span>
          <span>{statusMessage}</span>
        </div>
      )}
      
      {paymentStep === 1 && (
        <>
          <div className="amount-section">
            <label htmlFor="custom-amount" className="amount-label">Enter Amount</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                id="custom-amount"
                className="amount-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500 ~ 100000"
              />
            </div>
            <p className="amount-limits">Min: ₹500 | Max: ₹100,000</p>
          </div>
          
          <div className="predefined-amounts">
            {predefinedAmounts.map((amt, index) => (
              <button
                key={index}
                className={`amount-button ${parseInt(amount) === amt ? 'selected' : ''}`}
                onClick={() => handlePredefinedAmountClick(amt)}
              >
                ₹{amt.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
          
          <div className="payment-methods">
            <h3>Payment Method</h3>
            <div className="method-options">
              <button
                className={`method-button ${paymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                UPI Payment
              </button>
            </div>
          </div>
          
          <button
            className="proceed-button"
            onClick={proceedToPayment}
            disabled={!amount || isNaN(amount) || parseInt(amount) < 500 || parseInt(amount) > 100000 || isLoading}
          >
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </>
      )}
      
      {paymentStep === 2 && (
        <div className="manual-payment-section">
          <div className="payment-info">
            <h3>Payment Details</h3>
            <div className="info-row">
              <span>Transaction ID:</span>
              <span>{paymentId}</span>
            </div>
            <div className="info-row">
              <span>Amount:</span>
              <span>₹{parseInt(amount).toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          {/* 1. Pay using UPI section */}
          <div className="upi-section">
            <h3>Pay using UPI</h3>
            
            {upiOptions.length > 1 && (
              <div className="upi-selector">
                <label>Select Payment UPI:</label>
                <select 
                  className="upi-select"
                  onChange={handleUpiChange}
                  value={selectedUpi ? selectedUpi.id : ''}
                >
                  {upiOptions.map(upi => (
                    <option key={upi.id} value={upi.id}>
                      {upi.upi_name} ({upi.upi_id})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="upi-id-container">
              <div className="upi-details">
                <p className="upi-name">Pay to: <strong>{selectedUpi ? selectedUpi.upi_name : 'Loading...'}</strong></p>
                <input 
                  type="text" 
                  value={selectedUpi ? selectedUpi.upi_id : ''} 
                  readOnly 
                  className="upi-id-display" 
                />
              </div>
              <button className="copy-button" onClick={copyUpiId}>
                &#128203;
              </button>
            </div>
            
            {/* Direct UPI Payment Link */}
            <div className="upi-pay-now" style={{ textAlign: 'center', margin: '20px 0' }}>
              <a 
                href={getUpiPaymentLink()} 
                className="upi-pay-btn"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#28a745',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 30px',
                  fontSize: '18px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  margin: '10px 0'
                }}
              >
                Pay Now !
              </a>
            </div>
          </div>
          
          {/* 2. Pay using UPI Apps section */}
          <div className="payment-methods" style={{ marginBottom: '20px' }}>
            <h3>Pay using Apps</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '15px' }}>
              <a 
                href={`upi://pay?pa=${selectedUpi?.upi_id || ''}&pn=${selectedUpi?.upi_name || ''}&am=${amount || '0'}&cu=INR`}
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" 
                  alt="Google Pay" 
                  style={{ height: '30px', marginBottom: '5px' }}
                />
                <span style={{ fontSize: '12px' }}>Google Pay</span>
              </a>
              <a 
                href={`upi://pay?pa=${selectedUpi?.upi_id || ''}&pn=${selectedUpi?.upi_name || ''}&am=${amount || '0'}&cu=INR`}
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.png/800px-PhonePe_Logo.png" 
                  alt="PhonePe" 
                  style={{ height: '30px', marginBottom: '5px' }}
                />
                <span style={{ fontSize: '12px' }}>PhonePe</span>
              </a>
              <a 
                href={`upi://pay?pa=${selectedUpi?.upi_id || ''}&pn=${selectedUpi?.upi_name || ''}&am=${amount || '0'}&cu=INR`}
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/2560px-Paytm_Logo_%28standalone%29.svg.png" 
                  alt="Paytm" 
                  style={{ height: '30px', marginBottom: '5px' }}
                />
                <span style={{ fontSize: '12px' }}>Paytm</span>
              </a>
              <a 
                href={`upi://pay?pa=${selectedUpi?.upi_id || ''}&pn=${selectedUpi?.upi_name || ''}&am=${amount || '0'}&cu=INR`}
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: 'white'
                }}
              >
                <div style={{ 
                  background: '#3a7bd5', 
                  color: 'white', 
                  width: '30px', 
                  height: '30px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '5px',
                  marginBottom: '5px',
                  fontWeight: 'bold'
                }}>
                  UPI
                </div>
                <span style={{ fontSize: '12px' }}>Other Apps</span>
              </a>
            </div>
          </div>
          
          {/* 3. Payment Instructions section */}
          <div className="payment-instructions">
            <h3>Payment Instructions</h3>
            <ol>
              <li>Click on "Pay Now" button or select your preferred payment app</li>
              <li>Your UPI app should open with payment details pre-filled</li>
              <li>Complete the payment in your UPI app</li>
              <li>After payment is complete, note down the 12-digit UTR number from your payment receipt</li>
              <li>Enter the UTR number below and click "Submit Payment"</li>
            </ol>
          </div>
          
          <div className="utr-section">
            <label htmlFor="utr-input">Enter 12-digit UTR/Reference Number</label>
            <input
              type="text"
              id="utr-input"
              className="utr-input"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="Enter 12-digit UTR number"
              maxLength={12}
              pattern="[0-9]{12}"
            />
            <div className="utr-tip">
              You'll find this 12-digit number in your UPI payment confirmation receipt
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="back-step-button" 
              onClick={resetPayment}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              className="submit-button"
              onClick={submitManualPayment}
              disabled={isLoading || !utrNumber || utrNumber.length !== 12}
            >
              {isLoading ? 'Processing...' : 'Submit Payment'}
            </button>
          </div>
        </div>
      )}
      
      {paymentStep === 3 && (
        <div className="success-section">
          <div className="success-icon">
            &#9989;
          </div>
          <h3>Payment Request Submitted</h3>
          <p>Your payment request has been submitted successfully and is pending approval from the admin.</p>
          <p className="order-details">Transaction ID: {paymentId}</p>
          <p className="order-details">Amount: ₹{parseInt(amount).toLocaleString('en-IN')}</p>
          <p className="verification-note">
            This usually takes 15-30 minutes during business hours. Your account will be credited once verified.
          </p>
          <button className="new-payment-button" onClick={resetPayment}>
            Make Another Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default Deposit;