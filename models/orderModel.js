const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    bookId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book'
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    orderStatus: {
        type: String,
        enum: ['pending','accepted', 'rejected','returned'],
        default: 'pending',

    },
    fine:{
        type:Number,
        default:0
    },
    adminId: {
        type: mongoose.Schema.ObjectId
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    returnDate: {
        type:Date,
        default:null
    },
    payFine:{
        type:Boolean,
        default:false
    }
});

orderSchema.pre('save', async function (next) {
    if (this.fine==0) return next();
    this.payFine = true;
    next();
  });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;