import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import '../styles/Passbook.css';

const Passbook = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('user_id'); // Fetch the logged-in user's ID

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPassbookData = async () => {
      try {
        const response = await axios.get(`https://bhoom.miramatka.com/api/getPassbookData.php?userid=${userId}`);
        if (response.data.success) {
          setTransactions(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch passbook data');
        }
      } catch (error) {
        setError('An error occurred while fetching passbook data');
      } finally {
        setLoading(false);
      }
    };

    fetchPassbookData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="passbook-page">
      <Header />
      <div className="passbook-container">
        <table className="passbook-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {!userId || transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  {userId ? 'No data available, start playing' : 'No data available, start playing'}
                </td>
              </tr>
            ) : (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.type}</td>
                  <td>₹{transaction.amount.toFixed(2)}</td>
                  <td>{transaction.message || '-'}</td>
                  <td>{new Date(transaction.dt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {error && <div className="error">{error}</div>}
      </div>
      <BottomNav />
    </div>
  );
};

export default Passbook;
