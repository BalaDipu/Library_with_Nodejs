const express = require('express');
const authController = require('../../controllers/authController');
const userController = require('../../controllers/userController');

const router = express.Router();
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllusers);
router.route('/:id').get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUsers);

module.exports = router;