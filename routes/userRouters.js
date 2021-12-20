const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.patch('/updateMyPassword',authController.updatePassword);
router.get('/me', userController.getMe);
router.delete('/deleteMe',userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllusers);

module.exports = router;
