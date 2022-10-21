var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const donenv = require('dotenv').config();
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
const bodyParser = require('body-parser');
var cors = require('cors')

var app = express();

//mongoose setup 
const mongoDB = process.env.db_uri || process.env.MONGODB_URI
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))

app.use('/', indexRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, ()=> console.log('Listening on port 3000'))

module.exports = app;
