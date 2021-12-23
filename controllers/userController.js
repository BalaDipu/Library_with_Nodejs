const User = require("../models/userModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const filteredObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

const sendResponse =(res,data,statusCode)=>{
    res.status(statusCode).json({
        status:'success',
        data:{
            data
        }
    })
}

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(
            new appError('*You are not logged in. Please log in!!', 401)
        );
    }
    sendResponse(res,user,200);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    sendResponse(res,null,204);
});

exports.updateMe = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new appError('This route is not for password update', 403)
        );
    }
    const filteredBody = filteredObj(req.body, 'name', 'email');
    console.log(filteredBody);
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    })
    sendResponse(res,updateUser,200);
})


// Admin operation 
exports.getAllusers = catchAsync(async (req, res, next) => {
    const users = await User.find();
    sendResponse(res,users,200);
})

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    sendResponse(res,user,200);
})

exports.updateUsers = catchAsync(async(req,res,next)=>{
    if(req.body.password || req.body.passwordConfirm){
        return next(
            new appError('*This route is not for password change!', 403)
        )
    }
    const filteredBody = filteredObj(req.body,'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.params.id,filteredBody,{
        new:true,
        runValidators:true
    });
    sendResponse(res,updatedUser,200);
})

exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    sendResponse(res,null,204);
})


