var config = require('../config.js');
var mongoose = require('mongoose').connect(config.MongoDB);
var models = {};

/* User DB */
var UserSchema = require('./user.js');
models.User = mongoose.model('user',UserSchema);

/* Room DB */
var RoomSchema = require('./room.js');
models.Room = mongoose.model('room',RoomSchema);

/* Reservation DB */
var ReservationSchema = require('./reservation.js');
models.Reservation = mongoose.model('reservation',ReservationSchema);

module.exports = models;
