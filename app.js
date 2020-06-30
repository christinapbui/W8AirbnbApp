var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const AppError = require("./utils/AppError")
const mongoose = require("mongoose")

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth')
var expRouter = require('./routes/experiences')
require("dotenv").config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB, { 
  useCreateIndex: true, 
  useNewUrlParser: true, 
  useFindAndModify: false, 
  useUnifiedTopology: true 
})
.then(()=> console.log("connected to database"))


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/experiences', expRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(new AppError(404, "Route not found"));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({status: err.status, message: err.message, stack: err.stack})
  } else if (process.env.NODE_ENV === "production") {
    res.status(err.statusCode).json({status: err.status, message: err.message})
  };
});

module.exports = app;
