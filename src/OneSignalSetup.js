const sendNotification = async (title, message) => {
    try {
        const response = await fetch('https://bhoom.miramatka.com/api/send_notification.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                message,
            }),
        });

        const data = await response.json();
        console.log('Notification sent:', data);
        return data;
    } catch (error) {
        console.error('Error sending notification:', error);
        return null;
    }
};

export default sendNotification;
