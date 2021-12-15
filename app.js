const express =require('express');
const userRouter= require('./routes/userRouters');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/v1/users', userRouter);

module.exports = app;