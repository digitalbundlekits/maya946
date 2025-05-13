/* DepositHistory.jsx */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/DepositHistory.css';

const DepositHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_id');

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setError('User ID not found');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(
        `https://bhoom.miramatka.com/api/getDepositData.php?userid=${userId}`
      );
      if (response.data.success) {
        const data = response.data.data;
        setTransactions(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } else {
        setError(response.data.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching transaction data');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const getCurrentTransactions = () => {
    const end = currentPage * itemsPerPage;
    const start = end - itemsPerPage;
    return transactions.slice(start, end);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });

  const getStatusClass = (status, credited) => {
    if (credited === 1) return 'success';
    if (status === -1) return 'failed';
    return 'pending';
  };
  const getStatusText = (status, credited) => {
    if (credited === 1) return 'Success';
    if (status === -1) return 'Failed';
    return 'Pending';
  };

  // Header using old CSS classes
  const Header = () => (
    <div className="custom-header">
      <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
      <span className="page-title">Fund Deposit History</span>
    </div>
  );

  if (loading) {
    return (
      <div className="deposit-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deposit-page">
        <Header />
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchTransactions}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="deposit-page">
      <Header />

      <div className="transactions-container">
        {transactions.length > 0 ? (
          getCurrentTransactions().map((tx) => (
            <div key={tx.id} className="transaction-card">
              <div className="transaction-header">
                <span className="transaction-date">{formatDate(tx.dt)}</span>
                <span className={`transaction-status ${getStatusClass(tx.status, tx.credited)}`}>
                  {getStatusText(tx.status, tx.credited)}
                </span>
              </div>
              <div className="transaction-body">
                <div className="transaction-amount">
                  ₹{parseFloat(tx.amount).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="transaction-id">Order ID: {tx.id}</div>
              </div>
              {tx.utr && <div className="utr-number">UTR Number: {tx.utr}</div>}
              <div className="transaction-footer">
                <div>Request Type: Credit</div>
                <div>Deposit Mode: UPI / Bank</div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-transactions">
            <p>No deposit transactions found</p>
            <button className="add-funds-button" onClick={() => navigate('/deposit')}>
              Add Funds
            </button>
          </div>
        )}
      </div>

      {transactions.length > 0 && (
        <div className="pagination">
          <button className="pagination-button" onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="pagination-info">({currentPage}/{totalPages})</span>
          <button className="pagination-button" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DepositHistory;