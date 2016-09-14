var Reservation = (function(){
  var room_id = '';
  var room_info = null;
  var reservation_info = null;
  var start_day = '';
  var start_time = '';
  var end_time = '';
  var count_down = 60*5 -1;

  var getUrlParams = function() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
  };

  var GetHourDifference = function(start_time, end_time){
    var date1 = new Date("2015/01/01 " + start_time);
    var date2 = new Date("2015/01/01 " + end_time);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffHour = Math.ceil(timeDiff / (1000 * 3600));
    return diffHour;
  };

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
  };

  var Render = function(room_info){
    $('#reservation-title').html("'"+room_info.title+"' 예약하기");

    var params = getUrlParams();
    start_day = params.day;
    start_time = params.start_time;
    end_time = params.end_time;

    $('#start_day').html(start_day);
    $('#start_time').html(start_time);
    $('#end_time').html(end_time);

    var diff = GetHourDifference(start_time,end_time);
    var total_price = Number(diff) * room_info.price;
    $('#total_price').html(String(total_price) + "원");
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
    var title = $('#reservation-name').val();
    var password = $('#reservation-password').val();

    if( !title ){
      alert('예약 제목을 입력해주세요.');
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

  /*
  * RESERVAION PAGE MODULE INIT
  */
  var init = function(){
    room_id = getRoomIdFromURL();
    getRoomInfo(room_id);

    $('#reservation-submit').click(onClick_submit);

    var params = getUrlParams();
    if( !params.hasOwnProperty('day') || !params.hasOwnProperty('start_time') || !params.hasOwnProperty('end_time')){
      alert('잘못된 접근입니다.');
      location.href="/room/"+room_id;
    }

    setInterval(function(){
      if(count_down == 0){
        alert('예약 대기 시간이 만료되었습니다. 다시 에약을 해주세요.');
        location.href="/room/"+room_id;
      }
      var min = Math.floor(count_down / 60);
      var sec = count_down % 60;

      $('#count_down').html((min >= 10 ? min : '0'+min) +':'+ (sec >= 10 ? sec : '0'+sec));
      count_down--;
    },1000);
  };

  return {
    init : init
  };
})();

$(document).ready(Reservation.init());
