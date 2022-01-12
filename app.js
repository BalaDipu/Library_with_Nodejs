const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const XSS = require('xss-clean');
const userRouter = require('./routes/userRoutes/userRouters');
const adminRouter = require('./routes/userRoutes/adminRouters')
const bookAdminRouter = require('./routes/bookRoutes/bookAdminRoutes');
const userOrderRouter = require('./routes/orderRoutes/userOrderRouters');
const adminOrderRouter = require('./routes/orderRoutes/adminOrderRoutes');
const appError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const morgan = require('morgan');

const app = express();

//Global middleware
//Set security http headers
app.use(helmet());

//development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Limit requests from same api
const limiter = rateLimit({
    max:50,
    windowMs:60*60*1000,
    message:'Too many requests from this IP, please try again in an hour!'
})
app.use('/api',limiter);

//body parser, reading data from the body into req.body
app.use(express.json()); 

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(XSS());

//Routes
app.use('/api/v1/users', userRouter, adminRouter);
app.use('/api/v1/books', bookAdminRouter);
app.use('/api/v1/orders', userOrderRouter, adminOrderRouter);

// unexpected  router hit shows error
app.all('*', (req, res, next) => {
    next(
        new appError(`Can't find ${req.originalUrl} on this server!`, 404)
    );
})

app.use(globalErrorHandler);

module.exports = app;