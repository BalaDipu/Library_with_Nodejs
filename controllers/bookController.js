const Book = require("../models/bookModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const sendResponse = (res, data, statusCode) => {
    res.status(statusCode).json({
        status: 'success',
        data: {
            data
        }
    })
}

exports.createBook = catchAsync(async (req, res, next) => {
    const newBook = await Book.create({
        title: req.body.title,
        authorName: req.body.authorName,
        bookISBN: req.body.bookISBN,
        quantity: req.body.quantity,
        edition: req.body.edition,
        image: req.body.image,
        adminId: req.user.id
    })
    sendResponse(res, newBook, 201);
})

exports.getAllBooks = catchAsync(async (req, res, next) => {
    const books = await Book.find(req.books);
    sendResponse(res, books, 200);
})

exports.getBook = catchAsync(async (req, res, next) => {
    const book = await Book.findById(req.params.id);
    if (!book) {
        return next(
            new appError('No book found with this id', 404)
        );
    }
    sendResponse(res, book, 200);
})

exports.updateBook = catchAsync(async (req, res, next) => {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!updatedBook) {
        return next(
            new appError('No book found with this id', 404)
        );
    }

    sendResponse(res, updatedBook, 201);
})

exports.deleteBook = catchAsync(async (req, res, next) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
        return next(
            new appError('No book found with this id', 404)
        );
    }
    sendResponse(res, null, 204);
})