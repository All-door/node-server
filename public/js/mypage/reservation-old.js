var Reservation = (function(){

  var ReservationTemplate = '\
  <div class="col-md-6 col-sm-12">\
    <ul class="list-group list-group-flush">\
      <li class="list-group-item text-center" style="font-size:20px; border-radius: 10px 10px 0 0 !important; background-color: #FFD966 !important;"><%= reservation_title %></li>\
      <li class="list-group-item"><%= title %></li>\
      <li class="list-group-item"><%= time %></li>\
      <li class="list-group-item"><%= content %></li>\
      <li class="list-group-item"><%= address %></li>\
      <li class="list-group-item"><%= totalPrice %></li>\
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

        var status = '';
        if( data.status != '예약완료'){
          status = ' <small class="small" style="color : gray !important;">['+data.status+']</small>';
        }

        if(room.type == '숙박'){
          template += complied({
            reservation_title : "<strong>" + (data.title ? data.title : "타이틀 없음") + "</strong>"+status,
            title : "<strong>공간 이름</strong> : " + room.title,
            time : "<strong>예약 시작 시간</strong> : " + data.start_day,
            content : "<strong>예약 종료 시간</strong> : " + data.end_day,
            address : "<strong>공간 주소</strong> : " + (data.address ? data.address : room.address),
            totalPrice : "<strong>총 가격</strong> : " + (data.totalPrice ? data.totalPrice +"원" : "0원" ),
            room_id : data.room_id
          });
        }else{
          template += complied({
            reservation_title : "<strong>" + (data.title ? data.title : "타이틀 없음") + "</strong>"+status,
            title : "<strong>공간 이름</strong> : " + room.title,
            time : "<strong>예약 날짜</strong> : " + data.start_day,
            content : "<strong>예약 시간</strong> : " + data.start_time + " ~ " + data.end_time,
            address : "<strong>공간 주소</strong> : " + (data.address ? data.address : room.address),
            totalPrice : "<strong>총 가격</strong> : " + (data.totalPrice ? data.totalPrice +"원" : "0원" ),
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
    getReservation();
  };

  return {
    init : init
  };
})();

$(document).ready(Reservation.init());
