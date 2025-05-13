import React from 'react';
import sendNotification from '../api/notificationApi';

const NotificationTrigger = () => {
    const handleSendNotification = async () => {
        const response = await sendNotification('Test Notification', 'This is a test notification.');
        if (response) {
            alert('Notification sent successfully');
        } else {
            alert('Failed to send notification');
        }
    };

    return (
        <div>
            <button onClick={handleSendNotification}>Send Notification</button>
        </div>
    );
};

export default NotificationTrigger;
