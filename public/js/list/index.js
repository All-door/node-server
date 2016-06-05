var RoomList = (function(){

  var type = null;
  var RoomTemplate = '\
  <div class="col-md-4 col-sm-6 col-xs-12" style="overflow: hidden;" width="460px">\
      <div class="post-wrapper clearfix border-bottom">\
          <div class="hotel-wrapper">\
              <div class="post-media" style="width : 370px; height : 185px; overflow : hidden;">\
                  <a href="/room/<%= id %>"><img src="/api/images/<%= image %>" onerror="this.src=\'/upload/btn_bg_01.png\'" idth="370px" height="auto" class="img-responsive"></a>\
              </div>\
              <div class="post-title clearfix">\
                  <div class="pull-center">\
                      <h5><a href="/room" title=""><strong><%= title %></strong></a></h5>\
                  </div>\
              </div>\
              <p class="btn btn-default btn-success"><%= type %></p>\
              <p class="btn btn-default btn-success"><%= tag %></p>\
              <hr/>\
              <p><%= detail %></p>\
          </div>\
      </div>\
  </div>';

  var getUrlParams = function() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
  };

  var getRoomListFromServer = function(){
    var url = type == null ? '/api/room' : '/api/room/type/'+type;
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        Render(data.data);
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리지에게 문의해주세요.');
        location.href="/";
      }
    });
  };

  var Render = function(data){
    var template = '';
    _.each(data,function(room){
      var complied = _.template(RoomTemplate);
      template += complied({
        title : room.title,
        type : room.type,
        tag : room.tag,
        detail : room.detail.length < 100 ? room.detail : room.detail.substring(0,100),
        image : room.room_images[0],
        id : room._id
      });
    });
    $('#room-list').html(template);
    $('#loader').fadeOut();
  };

  var onClick_nav_total = function(e){
    e.stopPropagation();

    $('#nav-view').removeClass('active');
    $('#nav-total').addClass('active');
    $('#nav-reservation').removeClass('active');

    $('#loader').show();
    getRoomListFromServer();
   };

  var onClick_nav_view = function(e) {
    e.stopPropagation();

    $('#nav-view').addClass('active');
    $('#nav-total').removeClass('active');
    $('#nav-reservation').removeClass('active');

    $('#loader').show();
    var url = (type == null) ? '/api/room/sort/view' : '/api/room/type/'+type+'/sort/view'

    $.ajax({
      url : url,
      method : "GET",
      success : function(data){
        Render(data.data);
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리자에게 문의해주세요');
        location.href="/";
      }
    });
  };

  var onClick_nav_reservation = function(e){
    e.stopPropagation();

    $('#nav-view').removeClass('active');
    $('#nav-total').removeClass('active');
    $('#nav-reservation').addClass('active');

    $('#loader').show();

    var url = type == null ? '/api/room/sort/reservation' : '/api/room/type/'+type+'/sort/reservation';
    $.ajax({
      url : url,
      method : "GET",
      success : function(data){
        Render(data.data);
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리자에게 문의해주세요');
        location.href="/";
      }
    });
  };

  /*
  * ROOM LIST MODULE INIT
  */
  var init = function(){
    var params = getUrlParams();
    if( params.hasOwnProperty('type') ){
      type = decodeURI(params.type);
      type.replace('#','');
    }

    getRoomListFromServer();
    $('#nav-view').click(onClick_nav_view);
    $('#nav-total').click(onClick_nav_total);
    $('#nav-reservation').click(onClick_nav_reservation);
  };

  return {
    init : init
  };
})();

$(document).ready(RoomList.init());
