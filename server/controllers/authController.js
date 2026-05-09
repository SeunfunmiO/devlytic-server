const User = require('../models/User');
const Company = require('../models/Company');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');
const { sendWelcomeMail } = require('../utils/mailer');

// Register Developer
const registerDeveloper = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already in use' });

        const user = await User.create({ fullName, email, passwordHash: password });

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id, user.role);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        await sendWelcomeMail({ to: email, name: fullName, role: 'developer' });

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Register Company
const registerCompany = async (req, res) => {
    try {
        const { companyName, email, password } = req.body;

        const exists = await Company.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already in use' });

        const company = await Company.create({ companyName, email, passwordHash: password });

        const accessToken = generateAccessToken(company._id, company.role);
        const refreshToken = generateRefreshToken(company._id, company.role);

        company.refreshToken = refreshToken;
        await company.save({ validateBeforeSave: false });

        await sendWelcomeMail({ to: email, name: companyName, role: 'company' });

        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                _id: company._id,
                companyName: company.companyName,
                email: company.email,
                role: company.role,
                logo: company.logo,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const Model = role === 'company' ? Company : User;
        const account = await Model.findOne({ email });

        if (!account || !(await account.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(account._id, account.role);
        const refreshToken = generateRefreshToken(account._id, account.role);

        account.refreshToken = refreshToken;
        await account.save({ validateBeforeSave: false });

        res.status(200).json({
            accessToken,
            refreshToken,
            user: {
                _id: account._id,
                name: account.fullName || account.companyName,
                email: account.email,
                role: account.role,
                avatar: account.avatar || account.logo,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refresh Token
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const Model = decoded.role === 'company' ? Company : User;
        const account = await Model.findById(decoded.id);

        if (!account || account.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateAccessToken(account._id, account.role);

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).json({ message: 'Refresh token expired or invalid' });
    }
};

// Logout
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: 'No refresh token' });

        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const Model = decoded.role === 'company' ? Company : User;
        const account = await Model.findById(decoded.id);

        if (account) {
            account.refreshToken = '';
            await account.save({ validateBeforeSave: false });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerDeveloper, registerCompany, login, refreshToken, logout };