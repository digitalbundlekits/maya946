import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/JackpotChart.css';

const JackpotChart = () => {
    const { gameId } = useParams(); // Get gameId from the URL
    const navigate = useNavigate(); // For navigation
    const [chartData, setChartData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // List of specific numbers to highlight in red
    const highlightNumbers = [
        "00", "05", "11", "22", "33", "44", "55", "66", "77", "88", "99",
        "16", "27", "38", "49", "50", "61", "72", "83", "94"
    ];

    // Fetch data from API when the component mounts
    useEffect(() => {
        const fetchJackpotData = async () => {
            try {
                const apiUrl = `https://bhoom.miramatka.com/api/getJackpotResults.php?jackpotId=${gameId}`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.success) {
                    const sortedData = data.results.sort(
                        (a, b) =>
                            new Date(a.dateRange.split(' to ')[0]) -
                            new Date(b.dateRange.split(' to ')[0])
                    );
                    setChartData(sortedData);
                } else {
                    setErrorMessage(data.message || 'Failed to load chart data.');
                }
            } catch (error) {
                setErrorMessage('An error occurred while fetching data. Please try again later.');
            }
        };

        if (gameId) {
            fetchJackpotData();
        } else {
            setErrorMessage('Invalid or missing jackpot ID in the URL.');
        }
    }, [gameId]);

    // Scroll to the bottom of the page
    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Function to format numbers with leading zeros
    const formatResult = (result) => (result < 10 ? `0${result}` : result.toString());

    return (
        <div className="jcharts-page">
            {/* Header */}
            <header className="jcharts-header">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h1 className="jcharts-title">Jackpot Chart</h1>
            </header>

            <div className="jcharts-container">
                {errorMessage && <p className="jcharts-subheader">{errorMessage}</p>}

                {/* "Go to Bottom" Button */}
                <button className="jcharts-go-to-bottom" onClick={scrollToBottom}>
                    Go to Bottom ⬇️
                </button>

                {/* Chart Table */}
                {chartData.length > 0 ? (
                    <table className="jcharts-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Mon</th>
                                <th>Tue</th>
                                <th>Wed</th>
                                <th>Thu</th>
                                <th>Fri</th>
                                <th>Sat</th>
                                <th>Sun</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chartData.map((week, index) => (
                                <tr key={index}>
                                    <td className="jcharts-date-range">{week.dateRange}</td>
                                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                                        <td key={day}>
                                            {week[day] ? (
                                                <div
                                                    className={`jcharts-cell-content ${
                                                        highlightNumbers.includes(formatResult(week[day].result))
                                                            ? 'jcharts-highlight'
                                                            : ''
                                                    }`}
                                                >
                                                    {formatResult(week[day].result) || '**'}
                                                </div>
                                            ) : (
                                                <div className="jcharts-cell-content">---</div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    !errorMessage && <p>Loading chart data...</p>
                )}

                {/* "Back to Top" Button */}
                <button className="jcharts-back-to-top" onClick={scrollToTop}>
                    Back to Top ⬆️
                </button>

                {/* "Go Back" Button */}
                <button className="jcharts-go-back" onClick={() => navigate(-1)}>
                    Go Back ⬅️
                </button>
            </div>
        </div>
    );
};

export default JackpotChart;
