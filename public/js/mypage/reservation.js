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
        <%= modify %>\
        <%= cancel %>\
      </li>\
    </ul>\
  </div>';

  var getReservation = function(){
    var url = "/api/user/reserve";
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
        if(room == null){
          callback();
          return;
        }

        var complied = _.template(ReservationTemplate);

        var status = '';
        if( data.status != '예약완료'){
          status = ' <small class="small" style="color : gray !important;">['+data.status+']</small>';
        }

        if(room.type == '숙박'){
          template += complied({
            reservation_title : "<strong style=\"color: #FFFFFF;\">" + (data.title ? data.title : "타이틀 없음") + "</strong>"+status,
            title : "<strong>공간 이름</strong> : " + room.title,
            time : "<strong>예약 시작 시간</strong> : " + data.start_day,
            content : "<strong>예약 종료 시간</strong> : " + data.end_day,
            address : "<strong>공간 주소</strong> : " + (data.address ? data.address : room.address),
            totalPrice : "<strong>총 가격</strong> : " + (data.totalPrice ? data.totalPrice +"원" : "0원" ),
            room_id : data.room_id,
            cancel : data.status != '예약완료' ? '' : '<a class="delete btn btn-default" id="'+data._id+'">취소하기</a>',
            modify : data.status != '예약완료' ? '' : '<a class="modify btn btn-default" id="'+data._id+'">암호 변경하기</a>'
          });
        }else{
          template += complied({
            reservation_title : "<strong>" + (data.title ? data.title : "타이틀 없음") + "</strong>"+status,
            title : "<strong>공간 이름</strong> : " + room.title,
            time : "<strong>예약 날짜</strong> : " + data.start_day,
            content : "<strong>예약 시간</strong> : " + data.start_time + " ~ " + data.end_time,
            address : "<strong>공간 주소</strong> : " + (data.address ? data.address : room.address),
            totalPrice : "<strong>총 가격</strong> : " + (data.totalPrice ? data.totalPrice + "원" : "0원"),
            room_id : data.room_id,
            cancel : data.status != '예약완료' ? '' : '<a class="delete btn btn-default" id="'+data._id+'">취소하기</a>',
            modify : data.status != '예약완료' ? '' : '<a class="modify btn btn-default" id="'+data._id+'">암호 변경하기</a>'
          });
        }
        callback();
      });
    },function(err){
      $('#reservation-list').html(template);
      $('.delete').click(onClick_delete);
      $('.modify').click(onClick_modify);
    });
  };

  var onClick_delete = function(){
    var id = $(this).attr('id');

    if( confirm('예약을 취소하시겠습니까?')){
      var url = "/api/user/reserve/"+id;

      $.ajax({
        url : url,
        method : 'DELETE',
        success : function(data){
          alert('예약 취소가 완료되었습니다.');
          location.href="/mypage/reservation";
        },
        error : function(request,status,error){
          console.log(request);
          alert('서버 오류입니다. 관리자에게 문의해주세요.');
          location.href="/"
        }
      });
    }
  };

  var isNumber = function(s) {
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s == '' || isNaN(s)) return false;
    return true;
  };

  var onClick_modify = function(){
    var id = $(this).attr('id');
    var password = prompt("변경할 암호를 입력해주세요.");

    if( password.length != 0){
      var url = '/api/user/reserve/'+id;

      if ( !isNumber(password) ){
        alert('암호는 숫자만 가능합니다.');
        return;
      }

      $.ajax({
        url : url,
        method : 'PUT',
        dataType : 'json',
        data : {
          password : password
        },
        success : function(data){
          alert('암호 변경이 완료되었습니다.')
        },
        error : function(reuqest,status,error){
          location.href="/";
        }
      });
    }
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
