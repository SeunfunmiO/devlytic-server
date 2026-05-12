const Job = require('../models/Job');
const Company = require('../models/Company');

// Get all open jobs with filters
const getAllJobs = async (req, res) => {
    try {
        const { jobType, workMode, location, skills, search } = req.query;

        const filter = { status: 'open' };

        if (jobType) filter.jobType = jobType;
        if (workMode) filter.workMode = workMode;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (skills) {
            const skillsArray = skills.split(',');
            filter.skillsRequired = { $in: skillsArray };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const jobs = await Job.find(filter)
            .populate('company', 'companyName logo website industry')
            .sort({ isFeatured: -1, createdAt: -1 });

        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single job
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company', 'companyName logo website industry description');

        if (!job) return res.status(404).json({ message: 'Job not found' });

        res.status(200).json({ job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create job (company only)
const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            skillsRequired,
            salaryRange,
            jobType,
            workMode,
            location,
            expiresAt,
        } = req.body;

        const job = await Job.create({
            company: req.user.id,
            title,
            description,
            requirements,
            skillsRequired,
            salaryRange,
            jobType,
            workMode,
            location,
            expiresAt,
        });

        // Add job to company's postedJobs
        await Company.findByIdAndUpdate(req.user.id, {
            $push: { postedJobs: job._id },
        });

        res.status(201).json({ job });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update job (company only)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.company.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json({ job: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete job (company only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (job.company.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Job.findByIdAndDelete(req.params.id);

        await Company.findByIdAndUpdate(req.user.id, {
            $pull: { postedJobs: req.params.id },
        });

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get company's own jobs
const getCompanyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ company: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Save or unsave a job (developer)
const toggleSaveJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        const alreadySaved = job.savedBy.includes(req.user.id);

        if (alreadySaved) {
            await Job.findByIdAndUpdate(req.params.id, {
                $pull: { savedBy: req.user.id },
            });
            return res.status(200).json({ message: 'Job unsaved' });
        } else {
            await Job.findByIdAndUpdate(req.params.id, {
                $push: { savedBy: req.user.id },
            });
            return res.status(200).json({ message: 'Job saved' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get saved jobs (developer)
const getSavedJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ savedBy: req.user.id })
            .populate('company', 'companyName logo industry')
            .sort({ createdAt: -1 });

        res.status(200).json({ jobs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getCompanyJobs,
    toggleSaveJob,
    getSavedJobs,
};