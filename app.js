require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/files_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const filesRouter = require('./routes/files');

const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/files', filesRouter);

module.exports = app;
