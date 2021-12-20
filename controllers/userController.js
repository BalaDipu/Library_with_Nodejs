const User = require("../models/userModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


exports.getMe = catchAsync(async (req, res, next) => {
    req.params.id = req.user.id;
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(
            new appError('*You are not logged in. Please log in!!', 401)
        );
    }

    res.status(200).json({
        hello: user
    })
    next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: null
    })
});

exports.getAllusers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        data:{
            users
        }
    })
})