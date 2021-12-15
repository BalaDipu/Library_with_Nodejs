const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword',authController.updatePassword);

module.exports = router;
