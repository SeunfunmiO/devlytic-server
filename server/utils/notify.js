const Notification = require('../models/Notification');

const createNotification = async (io, { recipient, recipientRole, type, message, relatedJob, relatedApplication }) => {
    try {
        const notification = await Notification.create({
            recipient,
            recipientRole,
            type,
            message,
            relatedJob,
            relatedApplication,
        });

        // Emit real-time notification to recipient's room
        io.to(recipient.toString()).emit('notification', notification);

        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error.message);
    }
};

module.exports = { createNotification };