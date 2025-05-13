import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/FullSangam.css";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const FullSangam = () => {
  const [balance, setBalance] = useState(0);
  const [bids, setBids] = useState([]);
  const [openPanaInput, setOpenPanaInput] = useState("");
  const [closePanaInput, setClosePanaInput] = useState("");
  const [openPanaSeries, setOpenPanaSeries] = useState([]);
  const [closePanaSeries, setClosePanaSeries] = useState([]);
  const [selectedOpenPana, setSelectedOpenPana] = useState("");
  const [selectedClosePana, setSelectedClosePana] = useState("");
  const [points, setPoints] = useState("");

  // Router hooks
  const navigate = useNavigate();
  const { marketName } = useParams();
  const { state } = useLocation();
  
  // Dynamically receive marketId via state or default to 1
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
    9: ["999", "135", "126", "180", "234", "270", "289", "360", "379", "450", "469", "568", "478", "117", "144", "199", "225", "388", "559", "577", "667", "900"],
  };

  /**
   * Returns the appropriate database table, market field, and gameType (Full Sangam = 19)
   * based on the marketName and dynamic marketId.
   */
  const getMarketAndGameType = () => {
    // Adjust if different tables or fields are used for other markets
    if (marketName === "Mira Starline") {
      return { table: "sbids", marketIdField: "starline", gameTypeId: 19, marketId };
    }
    if (marketName === "Mira Jackpot") {
      return { table: "jbids", marketIdField: "jackpot", gameTypeId: 19, marketId };
    }
    // Default for other markets
    return { table: "bids", marketIdField: "market", gameTypeId: 19, marketId };
  };

  // Fetch user balance on component mount
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

  // Handle open Pana input
  const handleOpenPanaInputChange = (value) => {
    if (value === "" || isNaN(value) || value < 0 || value > 9) {
      setOpenPanaSeries([]);
      setOpenPanaInput(value);
      return;
    }
    setOpenPanaInput(value);
    setOpenPanaSeries(panaNumbers[value]);
  };

  // Handle close Pana input
  const handleClosePanaInputChange = (value) => {
    if (value === "" || isNaN(value) || value < 0 || value > 9) {
      setClosePanaSeries([]);
      setClosePanaInput(value);
      return;
    }
    setClosePanaInput(value);
    setClosePanaSeries(panaNumbers[value]);
  };

  // Add a new bid
  const handleAddBid = () => {
    if (!selectedOpenPana || !selectedClosePana || !points) {
      alert("Please fill all fields!");
      return;
    }
    const newBid = {
      openPana: selectedOpenPana,
      closePana: selectedClosePana,
      points: parseInt(points, 10),
    };
    setBids((prevBids) => [...prevBids, newBid]);
    // Reset fields
    setOpenPanaInput("");
    setClosePanaInput("");
    setSelectedOpenPana("");
    setSelectedClosePana("");
    setPoints("");
    setOpenPanaSeries([]);
    setClosePanaSeries([]);
  };

  // Calculate total points
  const totalPoints = bids.reduce((sum, bid) => sum + bid.points, 0);

  // Submit the bids
  const handleSubmit = () => {
    if (bids.length === 0) {
      alert("No bids to submit!");
      return;
    }
    const userId = localStorage.getItem("user_id");
    const { table, marketIdField, gameTypeId, marketId } = getMarketAndGameType();

    // Prepare the payload
    const payload = {
      user_id: userId,
      game_type: gameTypeId, // Full Sangam
      type: "close",
      bids: bids.map((bid) => ({
        digit: bid.openPana,   // Store openPana as 'digit'
        pana: bid.closePana,   // Store closePana as 'pana'
        points: bid.points,
      })),
      totalAmount: totalPoints,
      userbalance: balance - totalPoints,
      message: `${marketName ? marketName.toUpperCase() : "UNKNOWN"} FULL SANGAM`,
      market_table: table,
      market_id_field: marketIdField,
      market_id: marketId,
    };

    axios
      .post("https://bhoom.miramatka.com/api/placeBetPana.php", payload)
      .then((response) => {
        if (response.data.success) {
          setBalance(balance - totalPoints);
          setBids([]);
          alert("Bids submitted successfully!");
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting bets:", error);
        alert("Failed to submit the bids!");
      });
  };

  return (
    <div className="full-sangam-container">
      {/* Header */}
      <div className="header">
      <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
        <h2>{marketName ? marketName.toUpperCase() : "UNKNOWN"}, FULL SANGAM</h2>
        <div className="balance">
          <img
            src="/assets/wallet-icon.png"
            alt="Wallet Icon"
            className="wallet-icon"
          />
          ₹{balance}
        </div>
      </div>

      {/* Input Section */}
      <div className="input-section">
        <div className="input-group">
          <label>Open Pana</label>
          <input
            type="number"
            placeholder="Enter 0-9"
            value={openPanaInput}
            onChange={(e) => handleOpenPanaInputChange(e.target.value)}
            min="0"
            max="9"
          />
          {openPanaSeries.length > 0 && (
            <select
              value={selectedOpenPana}
              onChange={(e) => setSelectedOpenPana(e.target.value)}
            >
              <option value="">Select Open Pana</option>
              {openPanaSeries.map((pana, index) => (
                <option key={index} value={pana}>
                  {pana}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="input-group">
          <label>Close Pana</label>
          <input
            type="number"
            placeholder="Enter 0-9"
            value={closePanaInput}
            onChange={(e) => handleClosePanaInputChange(e.target.value)}
            min="0"
            max="9"
          />
          {closePanaSeries.length > 0 && (
            <select
              value={selectedClosePana}
              onChange={(e) => setSelectedClosePana(e.target.value)}
            >
              <option value="">Select Close Pana</option>
              {closePanaSeries.map((pana, index) => (
                <option key={index} value={pana}>
                  {pana}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="input-group">
          <label>Points</label>
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
              <th>Open Pana</th>
              <th>Close Pana</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid, index) => (
              <tr key={index}>
                <td>{bid.openPana}</td>
                <td>{bid.closePana}</td>
                <td>{bid.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <span>Total Points: ₹{totalPoints}</span>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default FullSangam;
