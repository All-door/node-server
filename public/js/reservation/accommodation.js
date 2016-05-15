var Acoomodation = (function(){
  var timeTableIds = ['time-0','time-1','time-2','time-3','time-4','time-5','time-6','time-7','time-8','time-9','time-10','time-11','time-12','time-13',
'time-14','time-15','time-16','time-17','time-18','time-19','time-20','time-21','time-22','time-23','time-24'];

  var room_id = '';
  var room_info = null;
  var reservation_info = null;

  var isNumber = function(s) {
    s += ''; // 문자열로 변환
    s = s.replace(/^\s*|\s*$/g, ''); // 좌우 공백 제거
    if (s == '' || isNaN(s)) return false;
    return true;
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

        var reservations = reservation_info.filter(function(reservaion){
          if(reservaion.start_day > getTodayDateString()){
            return true;
          }else{
            return false;
          }
        });
        var current = new Date();
        for(var i=0;i<15;i++){
          var year = current.getFullYear();
          var mm = current.getMonth()+1;
          var dd = current.getDate();

          var str = year;
          str += '-';
          str += (mm<=9)? '0'+mm : mm;
          str += '-';
          str += (dd<=9)? '0'+dd : dd;

          var reservation = reservations.filter(function(reservation){
            if(reservation.start_day <= str && reservation.end_day >= str){
              return true;
            }else{
              return false;
            }
          });

          $('#'+timeTableIds[i]).html('<td>'+mm+'/'+dd+'</td>');
          if(reservation.length != 0 ){
            $('#'+timeTableIds[i]).removeClass('success');
            $('#'+timeTableIds[i]).addClass('danger');
          }else{
            $('#'+timeTableIds[i]).removeClass('danger');
            $('#'+timeTableIds[i]).addClass('success');
          }
          current.setDate(current.getDate() + 1);
        }
      }
    });
  };

  var Render = function(room_info){
    $('#reservation-title').html("'"+room_info.title+"' 예약하기");
  };


  var onChange_datepicker = function(){
    var current = new Date(getTodayDateString()+ " 00:00:00");
    var select_day = new Date($(this).val());

    if(current > select_day){
      alert('오늘 날짜로부터 이후의 날짜만 예약이 가능합니다.');
      $(this).val('');
      return;
    }

    var start_time = new Date($('#datepicker').val()+ " 00:00:00");
    var end_time = new Date($('#datepicker1').val()+ " 00:00:00");

    if( end_time < start_time){
      alert('종료 날짜가 시작 날짜보다 이전이거나 동일합니다.');
      $(this).val('');
      return;
    }

    var reservations = reservation_info.filter(function(reservaion){
      if(reservaion.start_day > getTodayDateString()){
        return true;
      }else{
        return false;
      }
    });

    for(var i=0;i<15;i++){
      var year = select_day.getFullYear();
      var mm = select_day.getMonth()+1;
      var dd = select_day.getDate();

      var str = year;
      str += '-';
      str += (mm<=9)? '0'+mm : mm;
      str += '-';
      str += (dd<=9)? '0'+dd : dd;

      var reservation = reservations.filter(function(reservation){
        if(reservation.start_day <= str && reservation.end_day >= str){
          return true;
        }else{
          return false;
        }
      });

      $('#'+timeTableIds[i]).html('<td>'+mm+'/'+dd+'</td>');
      if(reservation.length != 0 ){
        $('#'+timeTableIds[i]).removeClass('success');
        $('#'+timeTableIds[i]).addClass('danger');
      }else{
        $('#'+timeTableIds[i]).removeClass('danger');
        $('#'+timeTableIds[i]).addClass('success');
      }
      select_day.setDate(select_day.getDate() + 1);
    }
  };

  var onChange_datepicker1 = function(){
    var current = new Date(getTodayDateString()+ " 00:00:00");
    var select_day = new Date($(this).val());

    if(current > select_day){
      alert('오늘 날짜로부터 이후의 날짜만 예약이 가능합니다.');
      $(this).val('');
      return;
    }

    var start_time = new Date($('#datepicker').val()+ " 00:00:00");
    var end_time = new Date($('#datepicker1').val()+ " 00:00:00");

    if( end_time < start_time){
      alert('종료 날짜가 시작 날짜보다 이전이거나 동일합니다.');
      $(this).val('');
      return;
    }

    var start_day = $('#datepicker').val().split('/')[2]+'-'+$('#datepicker').val().split('/')[0]+'-'+$('#datepicker').val().split('/')[1];
    var end_day = $('#datepicker1').val().split('/')[2]+'-'+$('#datepicker1').val().split('/')[0]+'-'+$('#datepicker1').val().split('/')[1];
    var reservations = reservation_info.filter(function(reservation){
      if( start_day >= reservation.start_day && start_day < reservation.end_day){
        return true;
      }
      if( end_day > reservation.start_day && end_day <= reservation.end_day){
        return true;
      }
      if(start_day <= reservation.start_day && end_day >= reservation.end_day){
        return true;
      }
      if(start_day >= reservation.start_time && end_day <= reservation.end_day){
        return true;
      }
      return false;
    });

    if( reservations.length != 0 ){
      alert('이미 예약된 날짜입니다.');
      $('#datepicker').val('');
      $('#datepicker1').val('');
      return;
    }
  };


  var onClick_submit = function(){
    var start_day = $('#datepicker').val().split('/')[2]+'-'+$('#datepicker').val().split('/')[0]+'-'+$('#datepicker').val().split('/')[1];
    var end_day = $('#datepicker1').val().split('/')[2]+'-'+$('#datepicker1').val().split('/')[0]+'-'+$('#datepicker1').val().split('/')[1];
    var password = $('#reservation-password').val();

    if( !start_day ){
      alert('시작 날짜를 입력해주세요');
      return;
    }

    if( !end_day ){
      alert('종료 날짜를 입력해주세요');
      return;
    }

    if( !password ){
      alert('암호를 입력해주세요');
      return;
    }

    var url = "/api/user/reserve/room/"+room_id;
    $.ajax({
      url : url,
      method : 'POST',
      dataType : 'json',
      data : {
        start_day : start_day,
        end_day : end_day,
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

  /*
  * ACCOMODATION MODULE INIT
  */
  var init = function(){
    room_id = getRoomIdFromURL();
    getRoomInfo(room_id);

    $('#datepicker').change(onChange_datepicker);
    $('#datepicker1').change(onChange_datepicker1);
    $('#reservation-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();

$(document).ready(Acoomodation.init());
