const express = require('express');
const userRouter = require('./routes/userRoutes/userRouters');
const adminRouter= require('./routes/userRoutes/adminRouters')
const bookAdminRouter = require('./routes/bookRoutes/bookAdminRoutes');
const bookUserRouter = require('./routes/bookRoutes/bookUserRoutes');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/users', userRouter,adminRouter);
app.use('/api/v1/books',bookAdminRouter);

module.exports = app;