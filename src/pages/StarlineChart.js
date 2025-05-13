import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/StarlineChart.css';

const StarlineChart = () => {
    const navigate = useNavigate();
    const { gameId } = useParams(); // Extract gameId from route
    const [chartData, setChartData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch data when the component mounts
    useEffect(() => {
        const fetchStarlineData = async () => {
            try {
                const apiUrl = `https://bhoom.miramatka.com/api/getStarlineResults.php?starlineId=${gameId}`;
                const response = await fetch(apiUrl);
                const data = await response.json();

                if (data.success) {
                    // Sort data by date ascending (oldest date at the top)
                    const sortedResults = data.results.sort((a, b) =>
                        new Date(a.dateRange.split(' to ')[0]) - new Date(b.dateRange.split(' to ')[0])
                    );
                    setChartData(sortedResults);
                } else {
                    setErrorMessage(data.message || 'Failed to load chart data.');
                }
            } catch (error) {
                setErrorMessage('An error occurred while fetching data. Please try again later.');
            }
        };

        if (gameId) {
            fetchStarlineData();
        } else {
            setErrorMessage('Invalid or missing Starline ID in the URL.');
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

    return (
        <div className="scharts-page">
            {/* Header */}
            <header className="scharts-header">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h1 className="scharts-title">Starline Chart</h1>
            </header>

            <div className="scharts-container">
                <p className="scharts-subheader">{errorMessage}</p>

                {/* "Go to Bottom" Button */}
                <button className="scharts-go-to-bottom" onClick={scrollToBottom}>
                    Go to Bottom ⬇️
                </button>

                {/* Chart Table */}
                {chartData.length > 0 ? (
                    <table className="scharts-table">
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
                                    <td className="scharts-date-range">{week.dateRange}</td>
                                    {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                                        <td key={day}>
                                            {week[day] ? (
                                                <div className="scharts-cell-content">
                                                    <div className="scharts-primary">{week[day].pana || '**'}</div>
                                                    <div className="scharts-secondary">{week[day].result || '**'}</div>
                                                </div>
                                            ) : (
                                                <div className="scharts-cell-content">---</div>
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

                {/* "Go to Top" Button */}
                <button className="scharts-go-to-top" onClick={scrollToTop}>
                    Go to Top ⬆️
                </button>

                {/* "Go Back" Button */}
                <button className="scharts-go-back" onClick={() => navigate(-1)}>
                    Go Back ⬅️
                </button>
            </div>
        </div>
    );
};

export default StarlineChart;
