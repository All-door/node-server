var Reservation = (function(){
  var timeTableIds = ['time-0','time-1','time-2','time-3','time-4','time-5','time-6','time-7','time-8','time-9','time-10','time-11','time-12','time-13',
'time-14','time-15','time-16','time-17','time-18','time-19','time-20','time-21','time-22','time-23','time-24'];
  var dayList = ['일','월','화','수','목','금','토','일'];

  var room_id = '';
  var room_info = null;
  var reservation_info = null;

  var isNumber = function(s) {
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s == '' || isNaN(s)) return false;
    return true;
  };

  var getRoomIdFromURL = function(){
    var link =  document.location.href.split('/');
    var index = link.indexOf('reservation') + 1;
    return link[index].replace('#','');
  };

  var getRoomInfo = function(room_id){
    var url = "/api/room/"+room_id;
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        if(data.data != null){
          room_info = data.data;

          Render(room_info);
        }else{
          alert('존재하지 않는 방입니다.');
          location.href = '/';
        }
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리지에게 문의해주세요.');
        location.href = '/';
      }
    });

    var url = "/api/room/"+room_id+"/reservation";
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        reservation_info = data.data;
      }
    });
  };

  var Render = function(room_info){
    $('#reservation-title').html("'"+room_info.title+"' 예약하기");

    if( room_info.type != '숙박'){
      $('#reservation-content-2').hide();
      var start_time = Number(room_info.enable_start_time.split(':')[0]);
      var end_time = Number(room_info.enable_end_time.split(':')[0]);
      var day_enable = room_info.day_enable;

      for(var i=0;i<24;i++){
        if( i >= start_time && i <= end_time){
          $('#'+timeTableIds[i]).removeClass('active');
          $('#'+timeTableIds[i]).removeClass('danger');
          $('#'+timeTableIds[i]).addClass('success');
        }else{
          $('#'+timeTableIds[i]).hide();
        }
      }

      $('#reservation-enabletime').html('<strong>예약 가능한 시간</strong> : '+room_info.enable_start_time+" ~ "+ room_info.enable_end_time);
      $('#reservation-enableday').html('<strong>예약 가능한 요일</strong> : ');
      for(var i=0;i<room_info.day_enable.length;i++){
        $('#reservation-enableday').append(room_info.day_enable[i]+' ');
      }

      $('#reservation-starttime').val(room_info.enable_start_time);
      $('#reservation-endtime').val(room_info.enable_end_time);
    }
  };

  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '-' + month + '-' + date;
  };

  var onClick_submit = function(){
    var today = getTodayDateString();
    var date = $('#datepicker').val();
    var title = $('#reservation-name').val();
    var start_time =  $('#reservation-starttime').val();
    var end_time = $('#reservation-endtime').val();
    var password = $('#reservation-password').val();

    if( !title ){
      alert('예약 제목을 입력해주세요.');
      return;
    }

    if( !date ){
      alert('예약 날짜를 입력해주세요.');
      return;
    }

    var day = dayList[new Date(date).getDay()];

    if(room_info.day_enable.indexOf(day) == -1 ){
      alert('예약이 불가능한 요일입니다.');
      return;
    }

    if( start_time >= end_time){
      alert('예약 시간이 동일하거나 종료 시간이 시작시간보다 앞섭니다.');
      return;
    }

    if( start_time < room_info.enable_start_time || end_time > room_info.enable_end_time){
      alert('사용이 불가능한 예약시간입니다.');
      return;
    }

    if( !password ){
      alert('암호를 입력해주세요.');
      return;
    }

    if( !isNumber(password)){
      alert('암호는 숫자만 가능합니다.');
      return;
    }

    var strings = date.split('/');
    var start_day = strings[2] + "-"+ strings[0] + "-" + strings[1];

    var url = "/api/user/reserve/room/"+room_id;
    $.ajax({
      url : url,
      method : 'POST',
      dataType : 'json',
      data : {
        title : title,
        start_day : start_day,
        end_day : start_day,
        start_time : start_time,
        end_time : end_time,
        password : password
      },
      success : function(data){
        alert('예약이 완료되었습니다.');
        location.href="/";
      },
      error : function(request,status,error){
        alert('중복된 예약시간이 존재합니다.');
      }
    });
  };

  var onChange_datepicker = function(){
    var _this = $(this);
    var today = new Date(getTodayDateString() + " 00:00:00").getTime();
    var select_day = new Date(_this.val() + " 00:00:00").getTime();

    if( select_day < today){
      _this.val('');
      alert('시간이 지난 요일은 선택할 수 없습니다.');
      return;
    }

    var strings = _this.val().split('/');
    var day = strings[2] + "-"+ strings[0] + "-" + strings[1];

    var reservations = reservation_info.filter(function(reservation){
      if(reservation.start_day >= day && reservation.end_day <= day){
        return true;
      }else{
        return false;
      }
    });

    for(var i=0;i<24;i++){
      $('#'+timeTableIds[i]).removeClass('danger');
      $('#'+timeTableIds[i]).addClass('success');
    }

    _.each(reservations,function(reservation){
      var start_time = Number(reservation.start_time.split(':')[0]);
      var end_time = Number(reservation.end_time.split(':')[0]);

      for( var i=start_time;i<end_time;i++){
        $('#'+timeTableIds[i]).removeClass('success');
        $('#'+timeTableIds[i]).addClass('danger');
      }
    });
  };

  var onChange_endtime = function(){
    var start_time = $('#reservation-starttime').val();
    var end_time = $('#reservation-endtime').val();
    var date = $('#datepicker').val();

    if( !date ){
      alert('예약 날짜 정보부터 입력해주세요.');
      return;
    }

    if( start_time >= end_time){
      alert('예약 시간이 동일하거나 종료 시간이 시작시간보다 앞섭니다.');
      $('#reservation-endtime').val($('#reservation-starttime').val());
      return;
    }

    var enable_start_time = room_info.enable_start_time;
    var enable_end_time = room_info.enable_end_time;

    if( start_time < enable_start_time || end_time > enable_end_time){
      alert('사용이 불가능한 예약시간입니다.');
      return;
    }

    var strings = date.split('/');
    var day = strings[2] + "-"+ strings[0] + "-" + strings[1];

    if( checkReservation(day,start_time,end_time) != 0 ){
      alert('이미 시간이 중복된 예약이 존재합니다.');
    }
  };

  var checkReservation = function(day,start_time,end_time){
    var reservations = reservation_info.filter(function(reservation){
      if(reservation.start_day >= day && reservation.end_day <= day){
        return true;
      }else{
        return false;
      }
    });

    var times = reservations.filter(function(reservation){
      if( start_time >= reservation.start_time && start_time < reservation.end_time){
        return true;
      }

      if( end_time > reservation.start_time && end_time <= reservation.end_time){
        return true;
      }

      if(start_time <= reservation.start_time && end_time >= reservation.end_time){
        return true;
      }

      if(start_time >= reservation.start_time && end_time <= reservation.end_time){
        return true;
      }

      return false;
    });

    return times.length;
  }
  /*
  * RESERVAION PAGE MODULE INIT
  */
  var init = function(){
    console.log("RESERVAION PAGE MODULE INIT");
    room_id = getRoomIdFromURL();
    getRoomInfo(room_id);

    $('#reservation-submit').click(onClick_submit);
    $('#datepicker').change(onChange_datepicker);
    $('#reservation-endtime').change(onChange_endtime);
  };

  return {
    init : init
  };
})();

$(document).ready(Reservation.init());
