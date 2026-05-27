const express = require('express');
const router = express.Router();
const { initiatePayment, verifyPayment } = require('../controllers/paymentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/initiate', protect, restrictTo('company'), initiatePayment);
router.get('/verify/:reference', protect, verifyPayment);

module.exports = router;