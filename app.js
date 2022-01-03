const express = require('express');
const userRouter = require('./routes/userRoutes/userRouters');
const adminRouter= require('./routes/userRoutes/adminRouters')
const bookAdminRouter = require('./routes/bookRoutes/bookAdminRoutes');
const userOrderRouter = require('./routes/orderRoutes/userOrderRouters');
const adminOrderRouter = require('./routes/orderRoutes/adminOrderRoutes');

const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/users', userRouter,adminRouter);
app.use('/api/v1/books',bookAdminRouter);
app.use('/api/v1/orders',userOrderRouter,adminOrderRouter);

module.exports = app;