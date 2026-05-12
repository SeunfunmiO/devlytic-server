const User = require('../models/User');
const Company = require('../models/Company');

// Update developer profile
const updateDeveloperProfile = async (req, res) => {
    try {
        const {
            fullName,
            bio,
            skills,
            githubUrl,
            portfolioUrl,
            availabilityStatus,
        } = req.body;

        const developer = await User.findByIdAndUpdate(
            req.user.id,
            { fullName, bio, skills, githubUrl, portfolioUrl, availabilityStatus },
            { new: true }
        ).select('-passwordHash -refreshToken');

        res.status(200).json({ user: developer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update company profile
const updateCompanyProfile = async (req, res) => {
    try {
        const { companyName, website, industry, description } = req.body;

        const company = await Company.findByIdAndUpdate(
            req.user.id,
            { companyName, website, industry, description },
            { new: true }
        ).select('-passwordHash -refreshToken');

        res.status(200).json({ user: company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateDeveloperProfile, updateCompanyProfile };