// src/App.js
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './styles/App.css';
import AppRoutes from './routes/AppRoutes';
import { getLoginSession } from './utils/storage';
import AutoLock from './components/AutoLock'; // Ensure the path is correct

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isWebInit, setIsWebInit] = useState(false);
  const [userId, setUserId] = useState(null); // Store userId for AutoLock
  const [initialLock, setInitialLock] = useState(false); // Indicates whether to show lock on initial render
  const navigate = useNavigate();
  const location = useLocation();
  const previousPathRef = useRef('');

  useEffect(() => {
    // Initialize OneSignal
    const initializeOneSignal = () => {
      if (typeof window !== 'undefined' && window.OneSignal) {
        // Native (Android/iOS)
        if (typeof window.OneSignal.setAppId === 'function') {
          console.log('Initializing OneSignal Native plugin...');
          if (!window.oneSignalNativeInitialized) {
            window.OneSignal.setAppId('dea056db-3b4a-4333-b209-8c1e3c5776ee');
            window.OneSignal.promptForPushNotificationsWithUserResponse((response) => {
              console.log('Native push permission response:', response);
              checkNativeSubscriptionStatus();
            });
            window.oneSignalNativeInitialized = true;
          } else {
            console.log('Native OneSignal already initialized. Skipping...');
          }
        } 
        // Web (Browser)
        else {
          console.log('Initializing OneSignal Web SDK...');
          if (!isWebInit) {
            window.OneSignal.init({
              appId: 'dea056db-3b4a-4333-b209-8c1e3c5776ee',
              allowLocalhostAsSecureOrigin: true, // for localhost testing
            });
            window.OneSignal.showSlidedownPrompt();
            checkWebSubscriptionStatus();
            setIsWebInit(true);
          } else {
            console.log('Web OneSignal already initialized. Skipping...');
          }
        }
      } else {
        console.warn('OneSignal not found; push notifications may not work.');
      }
    };

    // Check subscription status for native (Android/iOS)
    const checkNativeSubscriptionStatus = () => {
      if (typeof window.OneSignal.getDeviceState === 'function') {
        window.OneSignal.getDeviceState((state) => {
          if (state.isSubscribed) {
            console.log('User is subscribed to push notifications (Native).');
          } else {
            console.warn('User is NOT subscribed to push notifications (Native). Retrying...');
            retryNativeSubscription();
          }
        });
      } else {
        console.warn('getDeviceState not available for Native. Skipping subscription check.');
      }
    };

    // Check subscription status for web
    const checkWebSubscriptionStatus = async () => {
      try {
        const isSubscribed = await window.OneSignal.isPushNotificationsEnabled();
        if (isSubscribed) {
          console.log('User is subscribed to push notifications (Web).');
        } else {
          console.warn('User is NOT subscribed to push notifications (Web). Retrying...');
          retryWebSubscription();
        }
      } catch (error) {
        console.error('Error checking Web subscription status:', error);
      }
    };

    // Retry subscription for native (Android/iOS)
    const retryNativeSubscription = () => {
      if (window.OneSignal) {
        window.OneSignal.promptForPushNotificationsWithUserResponse((response) => {
          if (response) {
            console.log('User granted push notification permissions (Native).');
            checkNativeSubscriptionStatus();
          } else {
            console.warn('User still denied push notification permissions (Native).');
          }
        });
      }
    };

    // Retry subscription for web
    const retryWebSubscription = async () => {
      try {
        await window.OneSignal.showSlidedownPrompt();
        setTimeout(() => {
          checkWebSubscriptionStatus();
        }, 3000); // Delay to allow subscription status to update
      } catch (error) {
        console.error('Error retrying Web subscription:', error);
      }
    };

    // Validate user session
    const validateSession = async () => {
      try {
        const { userId, sessionId } = await getLoginSession();
        console.log('Retrieved Session:', { userId, sessionId });

        setUserId(userId); // Save userId for AutoLock

        if (sessionId) {
          const response = await fetch(
            'https://bhoom.miramatka.com/api/validateSession.php',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ session_id: sessionId }),
            }
          );

          const data = await response.json();
          console.log('Session validation response:', data);

          if (data.success) {
            console.log('Session is valid.');
            return;
          }
        }
        console.warn('Session invalid or missing, redirecting to login.');
        navigate('/login');
      } catch (error) {
        console.error('Session validation error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    initializeOneSignal();
    validateSession();
  }, [navigate, isWebInit]);

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const currentPath = location.pathname;
    console.log(`Navigated from ${previousPath} to ${currentPath}`);

    // If navigating from /login to /home, set initialLock to true
    if (previousPath === '/login' && currentPath === '/home') {
      console.log('Navigated from /login to /home, setting initialLock to true');
      setInitialLock(true);
    } else {
      setInitialLock(false); // Reset initialLock if navigating elsewhere
    }

    // Update the previous path
    previousPathRef.current = currentPath;
  }, [location.pathname]);

  const handleUnlock = () => {
    console.log('Unlocking the screen...');
    setInitialLock(false);
    try {
      localStorage.setItem('isLocked', 'false');
    } catch (error) {
      console.error('Error setting isLocked in localStorage:', error);
    }
  };

  const handleLock = () => {
    console.log('Locking the screen due to inactivity...');
    setInitialLock(true);
    try {
      localStorage.setItem('isLocked', 'true');
    } catch (error) {
      console.error('Error setting isLocked in localStorage:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const currentPath = location.pathname;

  return (
    <>
      {currentPath === '/home' && (
        <AutoLock
          userId={userId} // Pass userId to AutoLock
          initialLock={initialLock} // Pass initialLock prop
          onUnlock={handleUnlock} // Callback to unlock
          onLock={handleLock} // Callback to lock due to inactivity
        />
      )}
      <AppRoutes />
    </>
  );
};

export default App;
