import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/DepositHistory.css';

const Deposit = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('user_id'); // Fetch the logged-in user's ID

  const handleBack = () => {
    window.history.back(); // Go back to the previous page
  };

  useEffect(() => {
    const fetchDepositData = async () => {
      try {
        const response = await axios.get(`https://bhoom.miramatka.com/api/getWithdrawData.php?userid=${userId}`);
        if (response.data.success) {
          setTransactions(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch Withdraw data');
        }
      } catch (error) {
        setError('An error occurred while fetching Withdraw data');
      } finally {
        setLoading(false);
      }
    };

    fetchDepositData();
  }, [userId]);

  // Render Loading state
  if (loading) {
    return (
      <div>
        <div className="custom-header">
          <button className="back-buttonms" onClick={handleBack}>
            <img src="/assets/back-arrow.png" alt="Back" />
          </button>
          <span className="page-title">Fund Withdraw History</span>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Render Error state
  if (error) {
    return (
      <div>
        <div className="custom-header">
          <button className="ggdback-buttons" onClick={handleBack}>
            <img src="/assets/back-arrow.png" alt="Back" />
          </button>
          <span className="page-title">Fund Withdraw History</span>
        </div>
        <div className="error1">{error}</div>
      </div>
    );
  }

  // Render Transactions
  return (
    <div className="deposit-page">
      <div className="custom-header">
        <button className="ggdback-buttons" onClick={handleBack}>
          <img src="/assets/back-arrow.png" alt="Back" />
        </button>
        <span className="page-title">Fund Withdraw History</span>
      </div>
      <div className="transactions-container">
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={index} className="transaction-card">
              <div className="transaction-header">
                <span className="transaction-date">
                  {new Date(transaction.dt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
                <span
                  className={`transaction-status ${
                    transaction.credited === 1 ? 'success' : 'pending'
                  }`}
                >
                  {transaction.credited === 1 ? 'Success' : 'Pending'}
                </span>
              </div>
              <div className="transaction-body">
                <div className="transaction-amount">₹{transaction.amount.toFixed(2)}</div>
                <div className="transaction-id">Order ID: {transaction.id}</div>
              </div>
              <div className="transaction-footer">
                <div>Request Type: Withdraw</div>
                <div>Withdraw Mode: UPI / Bank</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-transactions">No transactions found</div>
        )}
      </div>
      <div className="pagination">
        <button className="pagination-button">Previous</button>
        <span className="pagination-info">(1/2)</span>
        <button className="pagination-button">Next</button>
      </div>
    </div>
  );
};

export default Deposit;
