var Room = models.Room;

module.exports = {
  'InsertRoom' : function(callback){
    callback = callback || function(){};
  },
  'UpdateRoom' : function(callback) {
    callback = callback || function(){};
  },
  'RemoveRoom' : function(callback) {
    callback = callback || function(){};
  },
  'GetRooms' : function(offset,limit,callback){
    callback = callback || function(){};
  },
  'GetRoomsByUserId' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomByRoomId' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomsByTag' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomsByView' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomsByReservation' : function(callback){
    callback = callback || function(){};
  },
  'GetRoomsByFavorite' : function(callback){
    callback = callback || function(){};
  }
};
