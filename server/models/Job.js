const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        requirements: [{ type: String }],
        skillsRequired: [{ type: String }],
        salaryRange: {
            min: { type: Number, default: 0 },
            max: { type: Number, default: 0 },
            currency: { type: String, default: 'USD' },
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship'],
            default: 'full-time',
        },
        workMode: {
            type: String,
            enum: ['remote', 'hybrid', 'onsite'],
            default: 'remote',
        },
        location: { type: String, default: '' },
        isFeatured: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open',
        },
        applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
        savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        expiresAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);