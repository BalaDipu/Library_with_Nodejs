const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A book must have a title']
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
    price: {
        type: Number,
        required: [true, 'A book must have price']
    },
    image:[String]
})

const Book = mongoose.model('Book',bookSchema);
module.exports = Book;