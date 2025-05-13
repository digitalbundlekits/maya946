import React, { useState } from 'react';
import axios from 'axios';
import '../styles/PaymentConfirmation.css'; // Ensure this file contains your styles

const PaymentConfirmation = () => {
  const [utr, setUtr] = useState(''); // UTR/transaction ID input
  const [screenshot, setScreenshot] = useState(null); // Screenshot file
  const [isLoading, setIsLoading] = useState(false);

  const amount = localStorage.getItem('recharge_amount');
  const upiId = localStorage.getItem('upi_id');
  const userId = localStorage.getItem('user_id'); // Get user ID from localStorage
  const selectedPaymentMethod = localStorage.getItem('selected_payment_method'); // Get payment method

  // Handle UTR input
  const handleUtrChange = (e) => {
    setUtr(e.target.value);
  };

  // Handle screenshot upload
  const handleScreenshotUpload = (e) => {
    setScreenshot(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!utr && !screenshot) {
      alert('Please provide a UTR or upload a screenshot.');
      return;
    }

    setIsLoading(true);

    // Prepare form data
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('amount', amount);
    formData.append('upi_id', upiId);
    formData.append('payment_method', selectedPaymentMethod);
    formData.append('utr', utr);
    if (screenshot) formData.append('screenshot', screenshot);

    try {
      const response = await axios.post(
        'https://bhoom.miramatka.com/api/createTransactionApi.php',
        formData
      );

      if (response.data.success) {
        alert('Transaction submitted successfully!');
      } else {
        alert(`Failed to submit transaction: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error submitting transaction:', error);
      alert('Failed to submit transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-confirmation-container">
      {/* Header */}
      <div className="payment-header">
        <h1 className="header-title">Recharge</h1>
        <h2 className="amount-title">₹{amount}</h2>
      </div>

      {/* Transaction Details */}
      <div className="transaction-details">
        <p>Transaction ID: <span>Generated ID</span></p>
        <p>Payment Mode: <span>{selectedPaymentMethod}</span></p>
        <p>VPA: <span>{upiId}</span></p>
      </div>

      {/* Copy Buttons */}
      <div className="copy-buttons">
        <button onClick={() => navigator.clipboard.writeText(amount)}>
          Copy Amt
        </button>
        <button onClick={() => navigator.clipboard.writeText(upiId)}>
          Copy UPI
        </button>
        <button>
          <a
            href={`upi://pay?pa=${upiId}&pn=${selectedPaymentMethod}&am=${amount}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open App
          </a>
        </button>
      </div>

      {/* Upload UTR/Screenshot Section */}
      <div className="upload-section">
        <p>If you have paid, please upload a screenshot or enter UTR.</p>
        <input
          type="text"
          className="utr-input"
          placeholder="Enter UTR"
          value={utr}
          onChange={handleUtrChange}
        />
        <input
          type="file"
          className="screenshot-input"
          onChange={handleScreenshotUpload}
        />
      </div>

      {/* Status Steps */}
      <div className="status-steps">
        <div className="step active">1. Upload</div>
        <div className="step">2. Processing</div>
        <div className="step">3. Complete</div>
      </div>

      {/* Submit Button */}
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Submit'}
      </button>
    </div>
  );
};

export default PaymentConfirmation;
