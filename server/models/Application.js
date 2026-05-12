const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
        developer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        coverLetter: { type: String, default: '' },
        matchScore: { type: Number, default: 0 },
        matchReason: { type: String, default: '' },
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'shortlisted', 'interview', 'rejected', 'archived'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);