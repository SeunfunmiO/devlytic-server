const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const fetchRoutes = require('./routes/fetchRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/fetch', fetchRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Devlytic server is running...' });
});

// MongoDB connection + server start
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });