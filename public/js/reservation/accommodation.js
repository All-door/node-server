var Acoomodation = (function(){
  var room_id = '';
  var room_info = null;
  var reservation_info = null;
  var start_day = '';
  var end_day = '';
  var count_down = 60*5 -1;

  var getUrlParams = function() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
  };

  var GetDateDifference = function(start_day, end_day){
    var date1 = new Date(start_day);
    var date2 = new Date(end_day);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays + 1;
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
    start_day = params.start_day;
    end_day = params.end_day;

    $('#start_day').html(start_day);
    $('#end_day').html(end_day);

    var diff = GetDateDifference(start_day,end_day);
    var total_price = Number(diff) * room_info.price;
    $('#total_price').html(String(total_price) + "원");
  };

  var onClick_submit = function(){
    var title = $('#reservation-name').val();
    var password = $('#reservation-password').val();

    if( !title ){
      alert('예약 제목을 입력해주세요.');
      return;
    }

    if( !password ){
      alert('암호를 입력해주세요');
      return;
    }

    if( !isNumber(password)){
      alert('암호는 숫자만 가능합니다.');
      return;
    }

    var face_image = $("input[name=faceimage]")[0].files[0];
    var formData = new FormData();
    formData.append('title', title);
    formData.append('start_day', start_day);
    formData.append('end_day', end_day);
    formData.append('password', password);
    formData.append('face_image', face_image);

    var url = "/api/user/reserve/room/"+room_id;
    $.ajax({
      url : url,
      method : 'POST',
      processData : false,
      contentType : false,
      data : formData,
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

    $('#reservation-submit').click(onClick_submit);

    var params = getUrlParams();
    if( !params.hasOwnProperty('start_day') || !params.hasOwnProperty('end_day')){
      alert('잘못된 접근입니다.');
      location.href="/room/"+room_id;
    }

    setInterval(function(){
      if(count_down == 0){
        alert('예약 대기 시간이 만료되었습니다. 다시 예약을 해주세요.');
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

$(document).ready(Acoomodation.init());
