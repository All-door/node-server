var Reservation = (function(){

  var ReservationTemplate = '\
  <div class="col-md-6 col-sm-12">\
    <ul class="list-group list-group-flush">\
    <li class="list-group-item"><%= reservation_title %></li>\
      <li class="list-group-item"><%= title %></li>\
      <li class="list-group-item"><%= time %></li>\
      <li class="list-group-item"><%= content %></li>\
      <li class="list-group-item center-block">\
        <a class="btn btn-default" href="/room/<%= room_id %>">방 정보 보기</a>\
      </li>\
    </ul>\
  </div>';

  var getReservation = function(){
    var url = "/api/user/reserve/old";
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
    async.each(data,function(data,callback){
      async.series([
        function(callback){
          var url = "/api/room/"+data.room_id;
          $.ajax({
            url : url,
            method : 'GET',
            success : function(data){
              callback(null,data.data);
            },
            error : function(request,status,error){
              alert('서버 오류입니다. 관리자에게 문의해주세요.');
              location.href="/";
            }
          });
        }
      ],function(err,result){
        var room = result[0];
        var complied = _.template(ReservationTemplate);

        if(room.type == '숙박'){
          template += complied({
            reservation_title : "<strong>" + (data.title ? data.title : "타이틀 없음") + "</strong>",
            title : "<strong>공간 이름</strong> : " + room.title,
            time : "<strong>예약 시작 시간</strong> : " + data.start_day,
            content : "<strong>예약 종료 시간</strong> : " + data.end_day,
            room_id : data.room_id
          });
        }else{
          template += complied({
            reservation_title : "<strong>" + (data.title ? data.title : "타이틀 없음") + "</strong>",
            title : "<strong>공간 이름</strong> : " + room.title,
            time : "<strong>예약 날짜</strong> : " + data.start_day,
            content : "<strong>예약 시간</strong> : " + data.start_time + " ~ " + data.end_time,
            room_id : data.room_id
          });
        }
        callback();
      });
    },function(err){
      $('#reservation-list').html(template);
    });
  };

  /*
    * MY PAGE RESERVAION MODULE INIT
  */
  var init = function(){
    console.log("MY PAGE RESERVAION MODULE INIT");
    getReservation();
  };

  return {
    init : init
  };
})();

$(document).ready(Reservation.init());
