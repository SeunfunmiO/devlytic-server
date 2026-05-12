const express = require('express');
const router = express.Router();
const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    getCompanyJobs,
    toggleSaveJob,
    getSavedJobs,
} = require('../controllers/jobController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.get('/', getAllJobs);
router.get('/saved', protect, restrictTo('developer'), getSavedJobs);
router.get('/company/mine', protect, restrictTo('company'), getCompanyJobs);
router.get('/:id', getJobById);
router.post('/', protect, restrictTo('company'), createJob);
router.put('/:id', protect, restrictTo('company'), updateJob);
router.delete('/:id', protect, restrictTo('company'), deleteJob);
router.put('/:id/save', protect, restrictTo('developer'), toggleSaveJob);

module.exports = router;