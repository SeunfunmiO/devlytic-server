const User = require('../models/User');
const Company = require('../models/Company');

const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const developer = await User.findByIdAndUpdate(
            req.user.id,
            { avatar: req.file.path },
            { new: true }
        ).select('-passwordHash -refreshToken');

        res.status(200).json({ user: developer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadResume = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const developer = await User.findByIdAndUpdate(
            req.user.id,
            { resumeUrl: req.file.path },
            { new: true }
        ).select('-passwordHash -refreshToken');

        res.status(200).json({ user: developer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadLogo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const company = await Company.findByIdAndUpdate(
            req.user.id,
            { logo: req.file.path },
            { new: true }
        ).select('-passwordHash -refreshToken');

        res.status(200).json({ user: company });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadAvatar, uploadResume, uploadLogo };