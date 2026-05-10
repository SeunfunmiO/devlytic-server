const express = require('express');
const router = express.Router();
const { fetchDeveloper, fetchCompany } = require('../controllers/fetchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/developer', protect, fetchDeveloper);
router.get('/company', protect, fetchCompany);

module.exports = router;