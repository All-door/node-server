var Favorite = (function(){
  var FavoriteTemplate = '\
  <div class="col-md-6 col-sm-12" style="width: 200px; height: 200px; overflow: hidden; margin-bottom:10px !important; ">\
      <img src="/api/images/<%= image %>" width="200px" height="auto" alt="" class="img-responsive center-block">\
  </div>\
  <div class="col-md-6 col-sm-12">\
      <div class="mini-desti-title">\
          <div class="pull-left">\
              <h6><%= title %></h6>\
              <hr/>\
              <p class="btn btn-default btn-success"><%= type %></p>\
              <p class="btn btn-default btn-default"><%= tag %></p>\
          </div>\
          <div class="clearfix"></div>\
          <div class="mini-desti-desc" style="margin-top : 5px !important;">\
              <p><strong>설명</strong> : <%= detail %> </p>\
              <div>\
                  <%= address %>\
                  <%= time_enable %>\
                  <%= day_enable %>\
                  <hr/>\
                  <a href="/room/<%= id %>" class="btn btn-default btn-default border-radius text-right">공간정보 보러가기</a>\
                  <a href="/room/<%= id %>" class="btn btn-default btn-deafult border-radius text-right">예약하러 가기</a>\
              </div>\
          </div>\
      </div>\
  </div>\
  <div class="col-md-12 col-sm-12">\
    <hr/>\
  </div>';

  var getUserFavorite = function(){
    var url = '/api/user/favorite'
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        Render(data.data);
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리자에게 문의해주세요.');
        location.href="/";
      }
    });
  };

  var getTimeString = function(starttime,endtime){
    return starttime + " ~ " + endtime;
  };

  var getDayEnableList = function(day_enable){
    var ret = '';
    _.each(day_enable,function(day){
      ret += day + " ";
    });
    return ret;
  };

  var Render_roomspec = function(key,value){
    return '<p style="margin-bottom:0px !important;"><strong>'+ key +'</strong> : '+ value +'</p>';
  };

  var Render = function(list){
    var template = '';

    async.each(list,function(data,callback){
      async.series([function(callback) {
        var url = "/api/room/"+data;
        $.ajax({
          url : url,
          method : 'GET',
          success : function(data){
            callback(null,data.data);
          }
        })
      }],function done(err, result){
        var room = result[0];
        var compiled = _.template(FavoriteTemplate);
        template += compiled({
          id : room._id,
          image : room.room_images[0],
          title : room.title,
          type : room.type,
          tag : room.tag,
          detail : room.detail.length > 100 ? room.detail.substring(0,100) : room.detail,
          address : Render_roomspec('공간 주소',room.address),
          time_enable : room.type == '숙박' ? '' : Render_roomspec('예약 가능한 시간',getTimeString(room.enable_start_time,room.enable_end_time)),
          day_enable : room.type == '숙박' ? '' : Render_roomspec('예약 가능한 요일',getDayEnableList(room.day_enable)),
        })
        callback();
      });
    },function done(err,result){
      $('#favorite-list').html(template);
    });
  };

  /*
  * MYPAGE Favorite MODULE INIT
  */
  var init = function(){
    getUserFavorite();
  };

  return {
    init : init
  };
})();

$(document).ready(Favorite.init());
