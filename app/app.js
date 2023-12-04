const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const globalErrorHandler = require('../middlewares/errorHandler');
const userRoute = require('../routes/userRoute');
const taskRoute = require('../routes/taskRoute');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());

// ROUTES 
app.use('/api/users', userRoute);
app.use('/api/tasks', taskRoute);

app.use(globalErrorHandler);

module.exports = app;
