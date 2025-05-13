import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Chart.css';

const Chart = () => {
    const [weeklyData, setWeeklyData] = useState([]);
    const { marketId } = useParams(); // Get the market ID from URL parameters
    const navigate = useNavigate(); // Navigation for back button

    const highlightDigits = [
        '00', '05', '11', '22', '33', '44', '55', '66', '77', '88', '99',
        '16', '27', '38', '49', '50', '61', '72', '83', '94'
    ]; // Digits to highlight in red

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://bhoom.miramatka.com/api/getWeeklyResults.php?marketId=${marketId}`);
                if (response.data.success) {
                    const sortedData = response.data.results.sort((a, b) =>
                        new Date(a.dateRange.split(' to ')[0]) - new Date(b.dateRange.split(' to ')[0])
                    );
                    setWeeklyData(sortedData);
                } else {
                    console.log('Error fetching data:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching weekly results:', error);
            }
        };

        fetchData();
    }, [marketId]);

    const calculateSumLastDigit = (number) => {
        const sum = number
            .toString()
            .split('')
            .reduce((acc, curr) => acc + parseInt(curr), 0);
        return sum % 10;
    };

    const formatCellData = (data) => {
        if (!data) return '---';
        const { open_pana, jodi, open_digit, close_digit, close_pana } = data;

        let middleValue;
        if (open_digit === '0' || close_digit === '0') {
            const openLastDigit = calculateSumLastDigit(open_pana);
            const closeLastDigit = calculateSumLastDigit(close_pana);
            middleValue = `${openLastDigit}${closeLastDigit}`;
        } else {
            middleValue = jodi || `${open_digit || '*'}${close_digit || '*'}`;
        }

        const isHighlighted = highlightDigits.includes(middleValue);

        return (
            <div className="chart-cell-content">
                <div className="chart-primary">{open_pana || '**'}</div>
                <div className={`chart-middle ${isHighlighted ? 'highlight-red' : ''}`}>
                    {middleValue}
                </div>
                <div className="chart-secondary">{close_pana || '**'}</div>
            </div>
        );
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="chart-page">
            {/* Fixed Header */}
            <header className="chart-header">
            <button onClick={() => navigate(-1)} className="back-buttonms">
    <img src="/assets/back-arrow.png" alt="Back" />
  </button>
                <h2 className="chart-title">Chart</h2>
            </header>

            {/* "Go to Bottom" Button */}
            <button className="chart-go-to-bottom" onClick={scrollToBottom}>
                Go to Bottom ⬇️
            </button>

            <div className="chart-container">
                <table className="chart-table">
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
                        {weeklyData.map((week, index) => (
                            <tr key={index}>
                                <td className="chart-date-range">{week.dateRange}</td>
                                <td>{formatCellData(week.mon)}</td>
                                <td>{formatCellData(week.tue)}</td>
                                <td>{formatCellData(week.wed)}</td>
                                <td>{formatCellData(week.thu)}</td>
                                <td>{formatCellData(week.fri)}</td>
                                <td>{formatCellData(week.sat)}</td>
                                <td>{formatCellData(week.sun)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* "Back to Top" Button */}
            <button className="chart-back-to-top" onClick={scrollToTop}>
                Back to Top ⬆️
            </button>

            <button className="chart-go-back" onClick={() => navigate(-1)}>
                Go Back ⬅️
            </button>
        </div>
    );
};

export default Chart;
