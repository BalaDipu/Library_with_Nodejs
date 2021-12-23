const Book = require("../models/bookModel");
const catchAsync = require("../utils/catchAsync");

const sendResponse =(res,data,statusCode)=>{
    res.status(statusCode).json({
        status:'success',
        data:{
            data
        }
    })
}

exports.createBook = catchAsync(async(req,res,next)=>{
    const newBook = await Book.create({
        title:req.body.title,
        authorName:req.body.authorName,
        bookISBN:req.body.bookISBN,
        price:req.body.price,
        image:req.body.image
    })
    sendResponse(res,newBook,201);
})

exports.getAllBooks = catchAsync(async(req,res,next)=>{
    const books = await Book.find(req.books);
    sendResponse(res,books,200);
})

exports.getBook = catchAsync(async(req,res,next)=>{
    const book = await Book.findById(req.params.id);
    sendResponse(res,book,200);
})

exports.updateBook = catchAsync(async(req,res,next)=>{
    const updatedBook = await Book.findByIdAndUpdate(req.params.id,req.body, {
        new:true,
        runValidators:true
    })

    sendResponse(res,updatedBook,201);
})

exports.deleteBook = catchAsync(async(req,res,next)=>{
    await Book.findByIdAndDelete(req.params.id);
    sendResponse(res,null,204);
})