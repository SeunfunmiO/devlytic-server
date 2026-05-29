const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, required: true },
        recipientRole: { type: String, enum: ['developer', 'company'], required: true },
        type: {
            type: String,
            enum: ['new_application', 'application_update', 'new_match'],
            required: true,
        },
        message: { type: String, required: true },
        isRead: { type: Boolean, default: false },
        relatedJob: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
        relatedApplication: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);