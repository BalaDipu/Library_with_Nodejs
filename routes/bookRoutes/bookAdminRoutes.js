const express = require('express');
const bookController = require('../../controllers/bookController')
const authController = require('../../controllers/authController');
const router = express.Router();


router.use(authController.protect);
router.get('/',bookController.getAllBooks);
router.use(authController.restrictTo('admin'));
router.post('/createBook', bookController.createBook);
router.route('/:id').get(bookController.getBook).patch(bookController.updateBook)
    .delete(bookController.deleteBook);

module.exports = router;