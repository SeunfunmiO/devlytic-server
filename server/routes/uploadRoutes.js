const express = require('express');
const router = express.Router();
const {
    uploadAvatar,
    uploadResume,
    uploadLogo,
} = require('../controllers/uploadController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
    uploadAvatar: avatarUpload,
    uploadResume: resumeUpload,
    uploadLogo: logoUpload,
} = require('../config/cloudinary');

router.post(
    '/avatar',
    protect,
    restrictTo('developer'),
    avatarUpload.single('avatar'),
    uploadAvatar
);

router.post(
    '/resume',
    protect,
    restrictTo('developer'),
    resumeUpload.single('resume'),
    uploadResume
);

router.post(
    '/logo',
    protect,
    restrictTo('company'),
    logoUpload.single('logo'),
    uploadLogo
);

module.exports = router;