const express = require('express');
const router = express.Router();
const {
    registerDeveloper,
    registerCompany,
    login,
    refreshToken,
    logout,
} = require('../controllers/authController');

router.post('/register/developer', registerDeveloper);
router.post('/register/company', registerCompany);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;