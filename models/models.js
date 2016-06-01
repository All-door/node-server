'use strict'
const config = require('../config.js');
const mongoose = require('mongoose').connect(config.MongoDB);
const models = {};

/* User DB */
let UserSchema = require('./user.js');
models.User = mongoose.model('user',UserSchema);

/* Room DB */
let RoomSchema = require('./room.js');
models.Room = mongoose.model('room',RoomSchema);

/* Reservation DB */
let ReservationSchema = require('./reservation.js');
models.Reservation = mongoose.model('reservation',ReservationSchema);

/* Commnet DB*/
let CommentSchema = require('./comment.js');
models.Comment = mongoose.model('comment',CommentSchema);

/* Review DB */
let ReviewSchema = require('./review.js');
models.Review = mongoose.model('review',ReviewSchema);

/* Device LOG DB */
let DeviceLogSchema = require('./device_log.js');
models.DeviceLog = mongoose.model('device_log',DeviceLogSchema);

/* Pre Reservation DB */
let PreReservationSchema = require('./pre_reservation.js');
models.PreReservation = mongoose.model('pre_reservation',PreReservationSchema);

module.exports = models;
