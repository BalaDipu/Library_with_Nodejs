const express = require('express');
const authController = require('../../controllers/authController');
const orderController= require('../../controllers/orderController');

const router = express.Router();
// const router = express.Router({ mergeParams: true });
router.use(authController.protect);

router.route('/createOrder').post(authController.restrictTo('user'),orderController.createOrder);
router.delete('/deleteOrder/:id', orderController.deleteOrder);
router.patch('/renewOrder/:id', orderController.renewOrder);
router.get('/myOrders', orderController.getMyOrders);

module.exports = router;