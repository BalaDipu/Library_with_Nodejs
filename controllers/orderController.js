const Book = require('../models/bookModel');
const Order = require('../models/orderModel');
const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


exports.createOrder = catchAsync(async (req, res, next) => {
  const bookId = req.body.bookId;
  const book = await Book.findById(bookId);
  if (!book) {
    return next(
      new appError('Invalid book id', 404)
    );
  }

  req.body.adminId = book.adminId;
  req.body.userId = req.user.id;

  const newOrder = await Order.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      order: newOrder
    }
  })
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOneAndDelete({ _id: req.params.id, orderStatus: 'pending' });
  if (!order) {
    return next(
      new appError('No order found with this id and statusCode')
    );
  }
  res.status(204).json({
    status: 'success',
    data: null
  })
});

exports.renewOrder = catchAsync(async (req, res, next) => {
  const renewOrder = await Order.findOneAndUpdate(
    { _id: req.params.id, orderStatus: 'accepted', returnDate: { $exists: true }, fine: { $eq: 0 } },
    { returnDate: null },
    { new: true, runValidators: true });

  if (!renewOrder) {
    return next(
      new appError('No order fount with this id', 504)
    );
  }
  res.status(204).json({
    status: 'success',
    data: {
      renewOrder
    }
  })
})



//Admin Functionality

exports.updateStatus = catchAsync(async (req, res, next) => {
  const updatedOrder = await Order.findOneAndUpdate({ _id: req.params.id, orderStatus: 'pending' }, { orderStatus: req.body.sendStatus },
    { new: true, runValidators: true });

  if (!updatedOrder) {
    return next(
      new appError('No order found with this id', 504)
    );
  }
  if(updatedOrder.orderStatus == "accepted"){
    const book = await Book.findOneAndUpdate(updatedOrder.bookId,{ $inc: { quantity: -1 }});
  }
  res.status(202).json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  })
})

exports.retuenDateUpdate = catchAsync(async (req, res, next) => {
  const updatedOrder = await Order.findOneAndUpdate({ _id: req.params.id, orderStatus: 'accepted' }, { returnDate: req.body.returnDate },
    { new: true, runValidators: true });

  if (!updatedOrder) {
    return next(
      new appError('No order found with this id', 504)
    );
  }
  res.status(202).json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  })
});

exports.returnBook = catchAsync(async (req, res, next) => {
  const updatedOrder = await Order.findOneAndUpdate({ _id: req.params.id, orderStatus: 'accepted', fine: { $eq: 0 } }, { orderStatus: 'returned' },
    { new: true, runValidators: true });

  if (!updatedOrder) {
    return next(
      new appError('No order found with this id or fine unpaid', 504)
    );
  }
  res.status(202).json({
    status: 'success',
    data: {
      order: updatedOrder
    }
  })
});

exports.payFine = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    returnDate: { $lt: Date.now() }
  });

  if (!order) {
    return next(
      new appError('No order found with this id.', 504)
    );
  }
  if (!order.payFine) {
    return next(
      new appError('No payment required', 504)
    );
  }
  order.payFine = false;
  order.fine = 0;
  await order.save();

  res.status(200).json({
    status: 'success',
    data: {
      order: order
    }
  })
});