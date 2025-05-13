import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/BidHistory.css";

const BidHistory = () => {
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!userId) return;

    const fetchBidHistory = async () => {
      try {
        const response = await axios.get(
          `https://bhoom.miramatka.com/api/getSartBidHistory.php?userid=${userId}&page=${currentPage}`
        );
        if (response.data.success) {
          setBidHistory(response.data.data.bids);
          setTotalPages(response.data.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching bid history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBidHistory();
  }, [userId, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Helper function to get status message and icon based on wstatus
  const getStatusMessage = (wstatus) => {
    switch (wstatus) {
      case 0:
        return { message: "Result Pending", icon: "⏳" };
      case 1:
        return { message: "Congratulations! You win 🎉", icon: "🎊" };
      case 2:
        return { message: "Better luck next time 👎", icon: "👎" };
      default:
        return { message: "Unknown Status", icon: "❓" };
    }
  };

  // Handler for back button
  const handleBack = () => {
    navigate(-1); // Navigate back
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="bid-history-container">
      <div className="header">
        <div className="header-content">
          <button onClick={handleBack} className="back-buttonms">
            <img src="/assets/back-arrow.png" alt="Back" />
          </button>
          <span className="title">Starline BID HISTORY</span>
        </div>
      </div>

      <div className="bid-list">
        {bidHistory.map((bid, index) => {
          const status = getStatusMessage(bid.wstatus);
          return (
            <div key={index} className="bid-card">
              <div className="market-header">
                {bid.starline} ({bid.type})
              </div>
              
              <div className="info-section">
                <div className="info-item">
                  <div className="info-label">Game Type</div>
                  <div className="info-value">{bid.gameType}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Digits</div>
                  <div className="info-value">{bid.digits}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Points</div>
                  <div className="info-value">{bid.points}</div>
                </div>
              </div>

              <div className="info-section">
                <div className="info-item">
                  <div className="info-label">Bid Id</div>
                  <div className="info-value">{bid.bidId}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Bid Date</div>
                  <div className="info-value">{bid.bidDate}</div>
                </div>
              </div>

              <div className="transaction-time">
                Transaction Time: {bid.transactionTime}
              </div>

              <div className="status-message">
                <span className="status-icon">{status.icon}</span>
                <span className="status-text">{status.message}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        <button 
          className="nav-button1"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          PREVIOUS
        </button>
        <div className="page-indicator">({currentPage}/{totalPages})</div>
        <button 
          className="nav-button1"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default BidHistory;
