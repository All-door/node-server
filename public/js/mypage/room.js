var Room = (function(){
  var RoomTemplate = '<div class="col-md-6 cardview-room" style="overflow: hidden;" width="370">\
    <div class="center-block" style="width: 370px; height: 185px; overflow: hidden; margin-bottom:10px !important;">\
      <img class="center-block" width="auto" height="185px" src="/api/images/<%= room_image %>" onerror="this.src=\'/upload/btn_bg_01.png\'">\
    </div>\
    <ul class="list-group list-group-flush center-block">\
      <li class="list-group-item"> <strong>공간 이름</strong> : <%= room_title %></li>\
      <li class="list-group-item"> <strong>도어락 상태</strong> : <%= status %></li>\
      <li class="list-group-item"> <strong>최근 출입 시간</strong> : <%= log_date %></li>\
      <li class="list-group-item text-center">\
        <a class="btn btn-default" href="/mypage/room/<%= id %>/dashboard">Dashboard</a>\
        <a class="btn btn-default" href="/mypage/room/<%= id %>">수정하기</a>\
        <a class="delete btn btn-default" id="<%= id%>">삭제하기</a>\
      </li>\
    </ul>\
    </div>';

  var getMyRooms = function(){
    $.ajax({
      url : '/api/user/room',
      method : 'GET',
      success : function(data){
        renderRooms(data.data);
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리자에게 문의해주세요.');
        location.href="/";
      }
    });
  };

  var getStringFromDate = function(date){
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();

    var result = '';
    result += year;
    result += '-';
    result += (month <= 9) ? '0'+month : month;
    result += '-';
    result += (day <= 9) ? '0'+day : day;
    result += ' ';
    result += (hour <= 9) ? '0'+hour : hour;
    result += ':';
    result += (min <= 9) ? '0'+min : min;
    result += '';
    return result;
  };

  var onClick_delete = function(){
    var id = $(this).attr('id');

    if(confirm('공간을 삭제하겟습니까?')){
      var url = '/api/user/room/'+id
      $.ajax({
        url : url,
        method : 'DELETE',
        success : function(data){
          alert('공간 삭제가 완료되었습니다.');
          location.href="/mypage/room";
        },
        error : function(request,status,error){
          alert('존재하지 않는 공간입니다.');
          locaiton.href="/mypage/room";
        }
      });
    }else{
    }
  };

  var renderRooms = function(rooms){
    var template = '';
    async.each(rooms,function(room,callback){
      async.series([
          function(callback){
            var url = '/api/device/'+room.device_id+'/status'
            $.ajax({
              url : url,
              method : 'GET',
              success : function(data){
                var now = new Date();
                var updateAt = new Date(data.data.updatedAt);
                if( now.getTime() - updateAt.getTime() < 1000 * 60 * 5 ){
                  callback(null,'Good');
                }else{
                  callback(null,'Bad');
                }
              },
              error : function(request,status,error){
                callback(null,'데이터가 존재하지 않습니다.');
              }
            })
          },
          function(callback){
            var url = '/api/device/'+room.device_id+'/log'
            $.ajax({
              url : url,
              method : 'GET',
              success : function(data){
                var log = data.data;
                if( log.length == 0){
                  callback(null,'데이터가 존재하지 않습니다.');
                }else{
                  var date = log[0].createdAt;
                  var str = getStringFromDate(date);
                  callback(null,str);
                }
              },
              error : function(request,status,error){
                callback(null,'데이터가 존재하지 않습니다');
              }
            });
          }
      ],function(err,results){
        var compiled = _.template(RoomTemplate);
        template += compiled({
          id : room._id,
          room_image : room.room_images[0],
          room_title : room.title,
          device_id : room.device_id,
          status : results[0],
          log_date : results[1]
        });
        callback();
      });
    },function(err){
      $('#mypage-rooms').html(template);
      $('.delete').click(onClick_delete);
    });
  };

  /*
  * MY PAGE ROOM MODULE INIT
  */
  var init = function(){
    getMyRooms();
  };

  return {
    init : init
  };
})();


$(document).ready(Room.init());
