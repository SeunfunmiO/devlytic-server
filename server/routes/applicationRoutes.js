const express = require('express');
const router = express.Router();
const {
    applyToJob,
    getDeveloperApplications,
    getJobApplicants,
    updateApplicationStatus,
    archiveApplication,
} = require('../controllers/applicationController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.post('/:jobId', protect, restrictTo('developer'), applyToJob);
router.get('/developer/mine', protect, restrictTo('developer'), getDeveloperApplications);
router.get('/job/:jobId', protect, restrictTo('company'), getJobApplicants);
router.put('/:id/status', protect, restrictTo('company'), updateApplicationStatus);
router.put('/:id/archive', protect, restrictTo('developer'), archiveApplication);

module.exports = router;