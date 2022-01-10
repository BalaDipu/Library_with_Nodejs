const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const crypto = require('crypto');
const { findOne, findById } = require('../models/userModel');
const { promisify } = require('util');
const sendEmail = require('../utils/sendEmail');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  user.passwordConfirm = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });
  createSendToken(newUser, 201, res);
});



exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new appError('*Please provide email and password!', 400)
    );
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new appError('*Incorrect email or password!', 401)
    );
  }
  // console.log(user.passwordResetToken);
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
}

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new appError('*You are not loggeg in. Please log in to get acces!', 401)
    );
  }
  //verify the token 
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //check the user is exists or not
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new appError("*The user belonging to this token does no longer exist", 401)
    );
  }
  //check if the password changed or not after the token has been issued
  //grant access
  req.user = currentUser;
  next();
});


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return next(
        new appError('You do not have permission to perform this role', 403)
      );
    }
    next();
  }
}



exports.updatePassword = catchAsync(async (req, res, next) => {
  // This req.user.id comes from protect middleware.

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new appError('*Your current password is wrong', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});



exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get the user by the given email
  const user = await User.findOne({ email: req.body.email });
  console.log(user);

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to the user email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: 
  ${resetUrl}.\n If  you don't forgot your password, Please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'token sent to email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new appError('There is an error sending the email,try again', 500)
    );
  }
});


exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get the user with this given token 
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user) {
    return next(new appError('*Token is invalid or has expired!', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});