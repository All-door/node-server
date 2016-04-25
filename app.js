'use strict'
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let multer = require('multer')();

let config = require('./config');
global.models = require('./models/models.js');
global.response = require('./controller/response');

let routes = require('./routes/index');
let login = require('./routes/login');

let user = require('./routes/api/user');
let user_room = require('./routes/api/user/room');
let user_favorites = require('./routes/api/user/favorite');
let user_reserve = require('./routes/api/user/reserve');

let room = require('./routes/api/room');
let room_comment = require('./routes/api/room/comment');

let review = require('./routes/api/review');

let device = require('./routes/api/device');

let app = express();
let passport = require('passport');
let session = require('express-session');
var RedisStore = require('connect-redis')(session);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(multer.array());

app.use(session({
  secret : config.Name,
  resave : true,
  saveUninitialized: true,
  store : new RedisStore(config.RedisOption)
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/login',login);

app.use('/api/user',user);
app.use('/api/user/favorite',user_favorites);
app.use('/api/user/room',user_room);
app.use('/api/user/reserve',user_reserve);

app.use('/api/room',room);
app.use('/api/room',room_comment);

app.use('/api/review',review);

app.use('/api/device',device);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next)=>{
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
