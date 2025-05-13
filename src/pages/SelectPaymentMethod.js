import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/SelectPaymentMethod.css'; // Ensure the styles file exists and is properly configured

const SelectPaymentMethod = () => {
  const [upiId, setUpiId] = useState(''); // Random UPI ID
  const [amount, setAmount] = useState(0); // Recharge amount
  const [selectedMethod, setSelectedMethod] = useState(''); // Selected payment method
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_id'); // Assuming user_id is stored in localStorage

  // Fetch the UPI ID and recharge amount from the API and localStorage
  useEffect(() => {
    const fetchUpiId = async () => {
      try {
        const response = await axios.get('https://bhoom.miramatka.com/api/pay/getRandomUpiApi.php');
        if (response.data.success) {
          setUpiId(response.data.upi); // Assuming the response contains a random UPI
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching UPI ID:', error);
      }
    };

    fetchUpiId();

    // Fetch recharge amount from localStorage
    const rechargeAmount = localStorage.getItem('recharge_amount');
    setAmount(rechargeAmount || 0);
  }, []);

  // Handle payment method selection
  const handlePaymentSelection = (method) => {
    setSelectedMethod(method);
  };

  // Proceed to confirmation
  const handleProceed = async () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }

    try {
      // Save the selected payment method in localStorage
      localStorage.setItem('selected_payment_method', selectedMethod);

      // Simulate saving the transaction (optional, adjust as per backend API logic)
      await axios.post('https://bhoom.miramatka.com/api/pay/createTransactionApi.php', {
        user_id: userId,
        amount,
        payment_method: selectedMethod,
        upi_id: upiId,
      });

      // Navigate to the payment confirmation page
      navigate('/paymentConfirmation');
    } catch (error) {
      console.error('Error proceeding with payment:', error);
      alert('Failed to proceed with payment. Please try again.');
    }
  };

  return (
    <div className="select-payment-container">
      {/* Header */}
      <div className="payment-header">
      <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
        <h1 className="header-title">Recharge</h1>
        <button className="help-button">Help</button>
      </div>

      {/* Recharge Amount Section */}
      <div className="amount-section">
        <p className="recharge-label">Recharge Amount</p>
        <p className="recharge-amount">₹{amount}</p>
        <div className="upi-section">
          <p className="upi-label">UPID: {upiId}</p>
          <button className="change-upi-button" onClick={() => window.location.reload()}>
            Change
          </button>
        </div>
      </div>

      {/* Payment Method Section */}
      <div className="payment-method-section">
        <p className="payment-method-label">Select Payment Method</p>
        <div className="payment-method-options">
          {['PhonePe', 'Paytm', 'GPay', 'UPI Apps'].map((method) => (
            <div
              key={method}
              className={`payment-option ${selectedMethod === method ? 'selected' : ''}`}
              onClick={() => handlePaymentSelection(method)}
            >
              {method}
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="tips-section">
        <p>Welcome to use the quick recharge mode, please use APP to complete the payment of ₹{amount}</p>
        <p>The transaction funds are guaranteed by the platform throughout the process, which is very safe.</p>
        <p>Please do not include any words in remarks.</p>
      </div>

      {/* Proceed Button */}
      <button className="proceed-button" onClick={handleProceed}>
        Proceed
      </button>
    </div>
  );
};

export default SelectPaymentMethod;
