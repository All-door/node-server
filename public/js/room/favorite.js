var Favorite = (function(){
  var room_id = '';
  var getUserFavorite = function(){
    var url = "/api/user/favorite";

    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        Render(data.data);
      }
    })
  };

  var Render = function(data){
    if( data.indexOf(room_id) > -1){
      $('#room-favorite').removeClass('glyphicon-heart-empty');
      $('#room-favorite').addClass('glyphicon-heart');
    }else{
      $('#room-favorite').removeClass('glyphicon-heart');
      $('#room-favorite').addClass('glyphicon-heart-empty');
    }
  };

  var getRoomIdFromURL = function(){
    var link =  document.location.href.split('/');
    var index = link.indexOf('room') + 1;
    return link[index];
  };

  var onClick_favorite = function(){
    if( $(this).hasClass('glyphicon-heart')){
      $('#room-favorite').removeClass('glyphicon-heart');
      $('#room-favorite').addClass('glyphicon-heart-empty');

      var url = "/api/user/favorite"
      $.ajax({
        url : url,
        method : 'DELETE',
        dataType : 'json',
        data : {
          room_id : room_id
        },
        success : function(data){
        },
        error : function(request,status,error){
          alert('서버 오류입니다. 관리자에게 문의해주세요.');
          location.href="/";
        }
      });
    }else{
      $('#room-favorite').removeClass('glyphicon-heart-empty');
      $('#room-favorite').addClass('glyphicon-heart');

      var url = "/api/user/favorite"
      $.ajax({
        url : url,
        method : 'POST',
        dataType : 'json',
        data : {
          room_id : room_id
        },
        success : function(data){
        },
        error : function(request,status,error){
          alert('서버 오류입니다. 관리자에게 문의해주세요.');
          location.href="/";
        }
      });
    }
  };

  /*
  * ROOM PAGE FAVORITE MODULE INIT
  */
  var init = function(){
    room_id = getRoomIdFromURL();
    getUserFavorite();

    $('#room-favorite').click(onClick_favorite);
  };

  return {
    init : init
  };
})();

$(document).ready(Favorite.init());
