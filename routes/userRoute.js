const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const isLoggedIn = require('../middlewares/isLoggedIn');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.get('/refresh-access-token', authController.validateRefreshToken, authController.refreshAccessToken);

router.use(isLoggedIn);
router.patch('/update-me', userController.uploadAvatarUser, userController.updateMe);
router.patch('/update-password', authController.updatePassword);

module.exports = router;
