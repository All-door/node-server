'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mime = require('mime-types')

const config = require('./config');
global.models = require('./models/models.js');
global.response = require('./controller/response');

const routes = require('./routes/index');
const user = require('./routes/api/user');
const user_room = require('./routes/api/user/room');
const user_favorites = require('./routes/api/user/favorite');
const user_reserve = require('./routes/api/user/reserve');
const room = require('./routes/api/room');
const room_comment = require('./routes/api/room/comment');
const room_reservation = require('./routes/api/room/reservation');
const review = require('./routes/api/review');
const search = require('./routes/api/search');
const device = require('./routes/api/device');

const app = express();
const passport = require('passport');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

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

/*
* WEB FRONT ROUTE
*/
app.use('/', routes);

/*
* API ROUTE
*/
app.use('/api/user',user);
app.use('/api/user/favorite',user_favorites);
app.use('/api/user/room',user_room);
app.use('/api/user/reserve',user_reserve);
app.use('/api/room',room);
app.use('/api/room',room_comment);
app.use('/api/room',room_reservation);
app.use('/api/review',review);
app.use('/api/device',device);
app.use('/api/search',search);
// app.use('/api/images',express.static(config.ImagePath));

app.use('/api/images/:image_id',(req, res, next)=>{
  let imagepath = path.join(config.ImagePath,req.params.image_id);
  res.header('Content-Type', 'image/*')
  res.sendFile(imagepath);
})
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
    console.log('==============')
    console.log(req.path);
    console.log(err.message);
    console.log('==============')

    res.status(err.status || 500);
    res.render('404', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.render('404', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
