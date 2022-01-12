const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const appError = require('../utils/appError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'The user must have a name']
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  active:{
    type:Boolean,
    default:true,
    select:false
  },
  photo: {
    type: String
  },
  passwordResetToken:String,
  passwordResetExpires:Date,
  password: {
    type: String,
    required: [true, 'provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'provide your password'],
    validate: {
      //this only works on CREATE SAVE..!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not the same'
    }
  }
});

userSchema.methods.correctPassword = async function(newCandidatePassword, userPassword){
  return await bcrypt.compare(newCandidatePassword, userPassword);
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.createPasswordResetToken = function(){
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now()+10*60*1000;
  return resetToken;
}

// query middleware
userSchema.pre(/^find/, function(next){
  // this points to the current query
  this.find({active:{$ne:false}});
  next();
})

const User = mongoose.model('User', userSchema);
module.exports = User;
