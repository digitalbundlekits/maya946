import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Market from '../components/Market';
import '../styles/Market.css';

const MarketList = () => {
    const [markets, setMarkets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMarketData = async () => {
            try {
                const response = await axios.get('https://bhoom.miramatka.com/api/marketApi.php');
                const currentTime = new Date();

                const marketsWithStatus = response.data.map((market) => {
                    const result = market.result || "***-**-***";

                    if (!market.open_time || !market.close_time) {
                        return { ...market, isOpen: false, result };
                    }

                    const [openHour, openMinute] = market.open_time.split(':').map(Number);
                    const [closeHour, closeMinute] = market.close_time.split(':').map(Number);

                    const openTime = new Date(currentTime);
                    openTime.setHours(openHour, openMinute, 0);

                    const closeTime = new Date(currentTime);
                    closeTime.setHours(closeHour, closeMinute, 0);

                    if (closeTime < openTime) {
                        closeTime.setDate(closeTime.getDate() + 1); // Handle overnight markets
                    }

                    const isOpen = currentTime >= openTime && currentTime <= closeTime;

                    return { ...market, isOpen, result, openTime, closeTime };
                });

                // Sort markets: Open markets first, then closed markets by `open_time`
                const sortedMarkets = marketsWithStatus.sort((a, b) => {
                    if (a.isOpen !== b.isOpen) {
                        return b.isOpen - a.isOpen; // Open markets first
                    }
                    return a.openTime - b.openTime; // Sort by `open_time` for the same status
                });

                setMarkets(sortedMarkets);
            } catch (error) {
                console.error('Error fetching market data:', error);
                setError('Failed to fetch market data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarketData();
    }, []);

    if (isLoading) return <div className="loading-message">Loading markets...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="market-wrapper">
            {markets.map((market, index) => (
                <Market
                    key={index}
                    marketId={market.market_id}
                    marketName={market.market_name}
                    result={market.result}
                    openTime={market.open_time}
                    closeTime={market.close_time}
                    status={market.isOpen ? 'open' : 'closed'}
                />
            ))}
        </div>
    );
};

export default MarketList;
