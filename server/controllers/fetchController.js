const User = require('../models/User');
const Company = require('../models/Company');

const fetchDeveloper = async (req, res) => {
    try {
        const developer = await User.findById(req.user.id).select('-passwordHash -refreshToken');

        if (!developer) {
            return res.status(404).json({ message: 'Developer not found' });
        }

        res.status(200).json({ user: developer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const fetchCompany = async (req, res) => {
    try {
        const company = await Company.findById(req.user.id).select('-passwordHash -refreshToken');

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({ user: company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { fetchDeveloper, fetchCompany };