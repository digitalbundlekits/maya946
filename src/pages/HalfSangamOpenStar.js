import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/HalfSangamOpen.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const HalfSangam = () => {
  const [balance, setBalance] = useState(0);
  const [bids, setBids] = useState([]);
  const [openPanaInput, setOpenPanaInput] = useState("");
  const [currentSeries, setCurrentSeries] = useState([]);
  const [selectedPana, setSelectedPana] = useState("");
  const [openDigit, setOpenDigit] = useState("");
  const [points, setPoints] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({});

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { marketName } = useParams();

  // Dynamically receive marketId via state or default to 1
  const { state } = useLocation();
  const marketId = state?.marketId || 1;

  // Predefined Pana numbers
  const panaNumbers = {
    0: ["000", "136", "127", "145", "190", "235", "280", "370", "389", "460", "479", "578", "569", "677", "668", "550", "488", "334", "299", "244", "226", "118"],
    1: ["111", "128", "137", "146", "236", "245", "290", "380", "470", "489", "560", "579", "678", "100", "119", "155", "227", "335", "344", "399", "588", "669"],
    2: ["222", "138", "129", "147", "156", "237", "246", "345", "390", "480", "570", "679", "589", "110", "200", "228", "255", "336", "499", "669", "688", "748"],
    3: ["333", "131", "120", "148", "157", "238", "247", "256", "346", "490", "580", "689", "670", "166", "227", "300", "337", "355", "455", "599", "779", "788"],
    4: ["444", "149", "130", "158", "167", "239", "248", "257", "347", "356", "590", "789", "680", "112", "220", "266", "338", "400", "446", "455", "699", "770"],
    5: ["555", "159", "140", "168", "230", "249", "258", "267", "348", "357", "456", "780", "690", "113", "122", "177", "339", "366", "447", "500", "799", "889"],
    6: ["666", "150", "123", "169", "178", "240", "259", "268", "349", "358", "367", "790", "457", "600", "114", "277", "330", "448", "466", "556", "880", "899"],
    7: ["777", "160", "124", "179", "250", "269", "278", "340", "359", "368", "458", "890", "115", "133", "188", "223", "377", "449", "557", "566", "700"],
    8: ["888", "134", "125", "170", "187", "260", "279", "350", "369", "378", "459", "567", "468", "116", "224", "233", "288", "440", "477", "558", "800", "990"],
    9: ["999", "135", "126", "180", "234", "270", "289", "360", "379", "450", "469", "568", "478", "117", "144", "199", "225", "388", "559", "577", "667", "900"]
  };

  /**
   * Determines the appropriate table, fields, and gameType based on the marketName.
   */
  const getMarketAndGameType = () => {
    if (marketName === "Mira Starline") {
      return { table: "sbids", marketIdField: "starline", gameTypeId: 18, marketId };
    }
    if (marketName === "Mira Jackpot") {
      return { table: "jbids", marketIdField: "jackpot", gameTypeId: 18, marketId };
    }
    return { table: "bids", marketIdField: "market", gameTypeId: 18, marketId };
  };

  /**
   * Fetch user balance on component mount.
   */
  useEffect(() => {
    const fetchBalance = async () => {
      const userId = localStorage.getItem("user_id");
      try {
        const response = await axios.post("https://bhoom.miramatka.com/api/getBalanceApi.php", {
          user_id: userId,
        });
        if (response.data) {
          setBalance(response.data.balance);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, []);

  /**
   * Handle input for "Close Pana" - populates the dropdown of pana numbers based on the digit entered.
   */
  const handleOpenPanaChange = (value) => {
    if (value === "" || isNaN(value) || value < 0 || value > 9) {
      setCurrentSeries([]);
      setOpenPanaInput(value);
      return;
    }
    setOpenPanaInput(value);
    setCurrentSeries(panaNumbers[value]);
    setTimeout(() => {
      if (dropdownRef.current) dropdownRef.current.focus();
    }, 0);
  };

  /**
   * Adds a new bid to the bids array if all fields are filled.
   */
  const handleAddBid = () => {
    if (!selectedPana || !openDigit || !points) {
      alert("Please fill all fields!");
      return;
    }
    const newBid = {
      pana: selectedPana,
      digit: openDigit,
      points: parseInt(points),
    };
    setBids((prevBids) => [...prevBids, newBid]);
    // Reset fields
    setOpenPanaInput("");
    setSelectedPana("");
    setOpenDigit("");
    setPoints("");
    setCurrentSeries([]);
  };

  // Calculate total points
  const totalPoints = bids.reduce((sum, bid) => sum + bid.points, 0);

  /**
   * Pre-submit check: if no bids, alert. Otherwise, show review modal.
   */
  const handleSubmit = () => {
    if (bids.length === 0) {
      alert("No bids to submit!");
      return;
    }
    setReviewData({
      bids,
      totalPoints,
      balanceBefore: balance,
      balanceAfter: balance - totalPoints,
    });
    setShowReviewModal(true);
  };

  /**
   * Confirms submission of the bets, sending them to the API.
   */
  const confirmSubmit = async () => {
    const userId = localStorage.getItem("user_id");
    const { table, marketIdField, gameTypeId, marketId } = getMarketAndGameType();

    const payload = {
      user_id: userId,
      game_type: gameTypeId,
      type: "close",
      market_table: table,
      market_id_field: marketIdField,
      market_id: marketId,
      bids,
      totalAmount: totalPoints,
      userbalance: balance - totalPoints,
      message: `${marketName ? marketName.toUpperCase() : "UNKNOWN"} HALF SANGAM`,
    };

    try {
      const response = await axios.post(
        "https://bhoom.miramatka.com/api/placeBetPana.php",
        payload
      );
      if (response.data.success) {
        // Update balance and clear bids
        setBalance(balance - totalPoints);
        setBids([]);
        setShowReviewModal(false);
        alert("Bids submitted successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting bet:", error);
      alert("Failed to submit the bids!");
    }
  };

  return (
    <div className="half-sangam-container">
      {/* Header */}
      <div className="headergj">
      <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
        <h2>{marketName ? marketName.toUpperCase() : "UNKNOWN"}, HALF SANGAM A</h2>
        <div className="balancemn">
          <img src="/assets/wallet-icon.png" alt="Wallet Icon" className="wallet-icon" /> 
          ₹{balance}
        </div>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <div className="input-group">
          <label>Close Pana</label>
          <input
            type="number"
            placeholder="Enter 0-9"
            value={openPanaInput}
            onChange={(e) => handleOpenPanaChange(e.target.value)}
            min="0"
            max="9"
          />
        </div>

        {currentSeries.length > 0 && (
          <div className="input-group">
            <label>Select Open Pana</label>
            <select
              ref={dropdownRef}
              value={selectedPana}
              onChange={(e) => setSelectedPana(e.target.value)}
            >
              <option value="">Select Pana</option>
              {currentSeries.map((pana, index) => (
                <option key={index} value={pana}>
                  {pana}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="input-group">
          <label>Open Digit</label>
          <input
            type="number"
            placeholder="Enter 0-9"
            value={openDigit}
            onChange={(e) => setOpenDigit(e.target.value)}
            min="0"
            max="9"
          />
        </div>

        <div className="input-group">
          <label>Enter Points</label>
          <input
            type="number"
            placeholder="Enter Points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            min="1"
          />
        </div>

        <button className="add-bid-button" onClick={handleAddBid}>
          ADD BID
        </button>
      </div>

      {/* Bids Table */}
      <div className="bids-section">
        <h4>Your Bids</h4>
        <table className="bid-table">
          <thead>
            <tr>
              <th>Pana</th>
              <th>Digit</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr key={index}>
                <td>{bid.pana}</td>
                <td>{bid.digit}</td>
                <td>{bid.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <span>Total Points: ₹{totalPoints}</span>
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={bids.length === 0}
        >
          Submit
        </button>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay">
          <div className="review-modal">
            <h3>Review Bets</h3>
            <table>
              <thead>
                <tr>
                  <th>Pana</th>
                  <th>Digit</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {reviewData.bids.map((bid, index) => (
                  <tr key={index}>
                    <td>{bid.pana}</td>
                    <td>{bid.digit}</td>
                    <td>{bid.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="review-summary">
              <p>Total Points: ₹{totalPoints}</p>
              <p>Balance Before: ₹{reviewData.balanceBefore}</p>
              <p>Balance After: ₹{reviewData.balanceAfter}</p>
            </div>
            <div className="modal-buttons">
              <button onClick={() => setShowReviewModal(false)}>Cancel</button>
              <button onClick={confirmSubmit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HalfSangam;
