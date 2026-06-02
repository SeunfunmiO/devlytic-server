const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { generateMatchScore } = require('../utils/aiMatch');
const { createNotification } = require('../utils/notify');

// Apply to a job (developer)
const applyToJob = async (req, res) => {
    try {
        const { coverLetter } = req.body;
        const jobId = req.params.jobId;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.status === 'closed') return res.status(400).json({ message: 'Job is closed' });

        const existing = await Application.findOne({
            job: jobId,
            developer: req.user.id,
        });
        if (existing) return res.status(400).json({ message: 'Already applied to this job' });

        // Fetch developer profile for AI scoring
        const developer = await User.findById(req.user.id);

        // Generate AI match score
        let matchScore = 0;
        let matchReason = '';
        let matchStrengths = [];
        let matchGaps = [];

        try {
            const aiResult = await generateMatchScore({ developer, job });
            matchScore = aiResult.score;
            matchReason = aiResult.reason;
            matchStrengths = aiResult.strengths;
            matchGaps = aiResult.gaps;
        } catch (aiError) {
            console.error('AI match scoring failed:', aiError.message);
            // Continue without AI score if it fails
        }

        const application = await Application.create({
            job: jobId,
            developer: req.user.id,
            coverLetter,
            resumeUrl: developer.resumeUrl || '',
            matchScore,
            matchReason,
            matchStrengths,
            matchGaps,
        });

        await Job.findByIdAndUpdate(jobId, {
            $push: { applicants: application._id },
        });
        await User.findByIdAndUpdate(req.user.id, {
            $push: { appliedJobs: jobId },
        });

        // After creating the application and updating job/developer
        // Send notification to company
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: job.company,
            recipientRole: 'company',
            type: 'new_application',
            message: `${developer.fullName} applied for your job: ${job.title}`,
            relatedJob: jobId,
            relatedApplication: application._id,
        });

        res.status(201).json({ application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get developer's applications
const getDeveloperApplications = async (req, res) => {
    try {
        const applications = await Application.find({ developer: req.user.id })
            .populate({
                path: 'job',
                populate: { path: 'company', select: 'companyName logo industry' },
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all applicants for a job (company)
const getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.company.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('developer', 'fullName email avatar skills availabilityStatus githubUrl portfolioUrl')
            .sort({ matchScore: -1 });

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update application status (company)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id)
            .populate('job');

        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (application.job.company.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        // After updating the status
        const io = req.app.get('io');
        await createNotification(io, {
            recipient: application.developer,
            recipientRole: 'developer',
            type: 'application_update',
            message: `Your application for ${application.job.title} has been ${status}`,
            relatedJob: application.job._id,
            relatedApplication: application._id,
        });

        res.status(200).json({ application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Archive application (developer)
const archiveApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        if (application.developer.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.status = 'archived';
        await application.save();

        res.status(200).json({ application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyToJob,
    getDeveloperApplications,
    getJobApplicants,
    updateApplicationStatus,
    archiveApplication,
};