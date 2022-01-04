const express = require('express');
const authController = require('../../controllers/authController');
const orderController= require('../../controllers/orderController');

const router = express.Router();
// const router = express.Router({ mergeParams: true });
router.use(authController.protect,authController.restrictTo('admin'));

// accept or reject order //update status field
// returnDate update //renew request accept
// if an user returns book, then admin canupdate the returned field
// admin will change the paid field

router.patch('/updateStatus/:id',orderController.updateStatus);

module.exports = router;