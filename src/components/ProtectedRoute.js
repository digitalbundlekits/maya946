import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getLoginSession } from '../utils/storage'; // Import Capacitor Preferences utility

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const validateSession = async () => {
            try {
                // Fetch the session ID from Capacitor Preferences
                const { sessionId } = await getLoginSession();
                console.log('Retrieved Session ID:', sessionId);

                if (sessionId) {
                    // Validate the session against the backend
                    const response = await fetch('https://bhoom.miramatka.com/api/validateSession.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ session_id: sessionId }),
                    });
                    const data = await response.json();
                    console.log('ProtectedRoute session validation response:', data);

                    // Set authentication status based on the server response
                    setIsAuthenticated(data.success);
                } else {
                    console.warn('No session ID found, redirecting to login.');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('ProtectedRoute session validation error:', error);
                setIsAuthenticated(false);
            } finally {
                // Stop the loading spinner regardless of success or failure
                setLoading(false);
            }
        };

        validateSession();
    }, []);

    // Display loading spinner or placeholder while checking session
    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading...</p> {/* Replace with a spinner or custom loader if needed */}
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Render the child components if authenticated
    return children;
};

export default ProtectedRoute;
