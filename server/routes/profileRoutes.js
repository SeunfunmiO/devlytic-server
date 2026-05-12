const express = require('express');
const router = express.Router();
const {
    updateDeveloperProfile,
    updateCompanyProfile,
} = require('../controllers/profileController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.put('/developer', protect, restrictTo('developer'), updateDeveloperProfile);
router.put('/company', protect, restrictTo('company'), updateCompanyProfile);

module.exports = router;