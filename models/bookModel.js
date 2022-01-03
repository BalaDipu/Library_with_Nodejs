const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A book must have a title']
    },
    edition:{
        type:String,
        default:'1st'
    },
    authorName: {
        type: String,
        required: [true, 'A book must have an author name']
    },
    bookISBN: {
        type: Number,
        required: [true, 'A  book must have an ISBN number'],
        unique: true
    },
    quantity:{
        type:Number,
        required:[true, 'Please provide quantity!']
    },
    adminId: {
        type: mongoose.Schema.ObjectId
    },
    image: [String]
})

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;