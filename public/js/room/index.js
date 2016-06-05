var RoomInfo = (function(){
  var room_id = '';
  var room_info = '';
  var imageTemplate = '\
  <div class="room_image_padding col-md-4" style="width: 370px; height: 185px; overflow: hidden; margin-bottom:10px !important;">\
    <img class="center-block" id="<%= image %>" src="/api/images/<%= image %>" height="185px" width="auto">\
  </div>';
  var reservation_info = [];

  var getStringFromDate = function(date){
    var date = new Date(date);
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var result = '';
    result += year;
    result += '-';
    result += (month <= 9) ? '0' + month : month;
    result += '-';
    result += (day  <= 9) ? '0' + day : day;
    return result;
  };

  var getRoomIdFromURL = function(){
    var link =  document.location.href.split('/');
    var index = link.indexOf('room') + 1;
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
          Render(data.data);
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

  var getReservation = function(room_id){
    var url = '/api/room/'+room_id+'/reservation';
    $.ajax({
      url : url,
      method : 'GET',
      success : function(resevation){
        reservation_info = resevation.data;
        console.log(reservation_info);
      }
    });
  }
  var onClick_image = function(){
    var id = $(this).attr('id');
    $('#room-modal-image').prop('src','/api/images/'+id);
    $('#imageModal').modal({
      keyboard: false
    });
    $('#imageModal').click(function(){
      $('#imageModal').modal('hide');
    });
    $('#room-modal-image').click(function(){
      $('#imageModal').modal('hide');
    });
  };

  var Render = function(room){
    $('#room-name').html('<strong>'+room.title+'</strong>');

    var date = getStringFromDate(room.createdAt);
    $('#room-createdAt').html('<i class="icon-attach"></i>'+date);
    $('#room-type').html(room.type);
    $('#room-tag').html(room.tag);

    var detail = '';
    var lines = room.detail.split('\n');
    for(var i = 0;i < lines.length;i++){
      detail +='<p style="margin-bottom:2px !important">' + lines[i] + '</p>';
    }
    $('#room-detail').html(detail);

    $('#room-address').html('<strong>공간 주소 : </strong>' + room.address);
    $('#room-capacity').html('<strong>최대 사용 인원 : </strong> ' + room.capacity + '명');

    if( room.type != '숙박'){
      $('#room-enabletime').html('<strong>사용 가능 시간 : </strong> ' + room.enable_start_time + ' ~ ' + room.enable_end_time);

      var day_enable = '';
      _.each(room.day_enable,function(day){
        day_enable += day + ' ';
      });
      $('#room-enableday').html('<strong>사용 가능 요일 : </strong>' + day_enable);
      $('#room-price').html('<strong>하루 당 가격 : </strong> '+room.price + '원');

      $('#room-reservation-2').hide();
    }else{
      $('#room-enabletime').hide();
      $('#room-enableday').hide();
      $('#room-price').html('<strong>시간 당 가격 : </strong> '+room.price + '원');

      $('#room-reservation-1').hide();
    }

    var template = '';
    var length = room.room_images.length;

    _.each(room.room_images,function(image){
      var complied = _.template(imageTemplate);
      template += complied({
        image : image
      });
    });

    $('#images').html(template);
    $('img').click(onClick_image);
  };


  var onClick_reservation = function(){
    if(room_info.type != '숙박'){
      var day = getdateStringYYYYMMDD($('#datepicker').val(),'-');
      var start_time = $('#room-starttime').val();
      var end_time = $('#room-endtime').val();

      if(!day){
        alert('예약 날짜를 입력해주세요.');
        return;
      }

      if(!start_time){
        alert('시작 시간을 입력해주세요.');
        return;
      }

      if(!end_time){
        alert('종료 시간을 입력해주세요.');
        return;
      }

      if( start_time >= end_time){
        alert('종료시간이 시작시간와 동일하거나 이전입니다.');
        return;
      }

      if( checkReservation(day,start_time,end_time) == 0 ){
        location.href="/reservation/"+room_info._id+"?day="+day+"&start_time="+start_time+"&end_time="+end_time;
      }else{
        alert('예약이 불가능합니다.');
        return;
      }
    }else{
      var start_day = getdateStringYYYYMMDD($('#datepicker2').val(),'-');
      var end_day = getdateStringYYYYMMDD($('#datepicker3').val(),'-');

      if(!start_day){
        alert('시작 날짜를 입려해주세요.');
        return;
      }
      if(!end_day){
        alert('종료 날짜를 입력해주세요.');
        return;
      }

      if(start_day > end_day){
        alert('시작 날짜가 종료 날짜보다 이후입니다.');
        return;
      }

      if(checkReservation_accom(start_day,end_day) == 0){
        location.href="/reservation/"+room_info._id+"?start_day="+start_day+"&end_day="+end_day;
      }else{
        alert('예약이 불가능합니다.');
        return;
      }

    }
  };

  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '/' + month + '/' + date;
  };

  var onChange_datepicker = function(){
    var _this = $(this);
    var today = new Date(getTodayDateString() + " 00:00:00");
    var select_day = new Date(_this.val() + " 00:00:00");

    if( select_day.getTime() < today.getTime()){
      _this.val('');
      alert('시간이 지난 요일은 선택할 수 없습니다.');
      return;
    }
    var week = ['일','월','화','수','목','금','토','일'];
    var day = week[select_day.getDay()];

    if( room_info.day_enable.indexOf(day) == -1 ){
      _this.val('');
      alert('이용이 불가능한 요일입니다.');
      return;
    }
  };

  var onChange_starttime = function(){
    var start_time = $(this).val();
    if( room_info.enable_start_time > start_time ){
      alert('이용 가능 시간보다 이전이거나 이후입니다.');
      $(this).val(room_info.enable_start_time);
    }

    if( room_info.enable_end_time < start_time ){
      alert('이용 가능 시간보다 이전이거나 이후입니다.');
      $(this).val(room_info.enable_start_time);
    }

    var day = getdateStringYYYYMMDD($('#datepicker').val(),'-');
    var start_time = $('#room-starttime').val();
    var end_time = $('#room-endtime').val();
    if( day && start_time && end_time && start_time < end_time){
      if( checkReservation(day,start_time,end_time) == 0 ){
        $('#message').removeClass('alert-danger');
        $('#message').addClass('alert-success');
        $('#message').html('예약이 가능합니다.');
        $('#message').fadeIn();
        return;
      }else{
        $('#message').removeClass('alert-success');
        $('#message').addClass('alert-danger');
        $('#message').html('예약이 불가능합니다.');
        $('#message').fadeIn();
        return;
      }
    }

    $('#room-endtime').val($('#room-starttime').val());
  };

  var onchange_endtime = function(){
    var end_time = $(this).val();
    if( room_info.enable_start_time > end_time ){
      alert('이용 가능 시간보다 이전이거나 이후입니다.');
      $(this).val(room_info.enable_end_time);
    }

    if( room_info.enable_end_time < end_time ){
      alert('이용 가능 시간보다 이전이거나 이후입니다.');
      $(this).val(room_info.enable_end_time);
    }

    var day = getdateStringYYYYMMDD($('#datepicker').val(),'-');
    var start_time = $('#room-starttime').val();
    var end_time = $('#room-endtime').val();

    if( start_time >= end_time){
      alert('종료시간이 시작시간보다 이전이거나 동일합니다.');
      return;
    }

    if( !day || !start_time || !end_time ){
      $('#message').html('예약 데이터를 입력해주세요.');
      return;
    }

    if( day && start_time && end_time && start_time < end_time){
      if( checkReservation(day,start_time,end_time) == 0 ){
        $('#message').removeClass('alert-danger');
        $('#message').addClass('alert-success');
        $('#message').html('예약이 가능합니다.');
        $('#message').fadeIn();
        return;
      }else{
        $('#message').removeClass('alert-success');
        $('#message').addClass('alert-danger');
        $('#message').html('예약이 불가능합니다.');
        $('#message').fadeIn();
        return;
      }
    }
  };

  var getdateStringYYYYMMDD = function(string,sep){
    if( !string ){
      return null;
    }
    return string.split('/')[2] + sep + string.split('/')[0] + sep + string.split('/')[1];
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

  var onChange_datepicker2 = function(){
    var today = new Date(getTodayDateString() + " 00:00:00");
    var start_day = new Date(getdateStringYYYYMMDD($('#datepicker2').val(),'/') + " 00:00:00");
    var end_day = new Date(getdateStringYYYYMMDD($('#datepicker3').val(),'/') + " 00:00:00");

    if(start_day.getTime() < today.getTime()){
      alert('오늘 이전 날짜는 선택하실수가 없습니다.');
      return;
    }

    if( $('#datepicker2').val()  && $('#datepicker3').val() &&  $('#datepicker2').val() <  $('#datepicker3').val()){
      if( start_day.getTime() > end_day.getTime()){
        alert('종료 날짜가 시작 날짜보다 이전입니다.');
        $(this).val('');
        return;
      }

      if(checkReservation_accom(getdateStringYYYYMMDD($('#datepicker2').val(),'-'),getdateStringYYYYMMDD($('#datepicker3').val(),'-')) == 0){
        $('#message').removeClass('alert-danger');
        $('#message').addClass('alert-success');
        $('#message').html('예약이 가능합니다.');
        $('#message').fadeIn();
        return;
      }else{
        $('#message').removeClass('alert-success');
        $('#message').addClass('alert-danger');
        $('#message').html('예약이 불가능합니다.');
        $('#message').fadeIn();
        return;
      }
    }

    $('#datepicker3').val($('#datepicker2').val());
  };

  var onChange_datepicker3 = function(){
    var today = new Date(getTodayDateString() + " 00:00:00");
    var start_day = new Date(getdateStringYYYYMMDD($('#datepicker2').val(),'/') + " 00:00:00");
    var end_day = new Date(getdateStringYYYYMMDD($('#datepicker3').val(),'/') + " 00:00:00");

    if(end_day.getTime() < today.getTime()){
      alert('오늘 이전 날짜는 선택하실수가 없습니다.');
      return;
    }

    if( $('#datepicker2').val()  && $('#datepicker3').val() &&  $('#datepicker2').val() <  $('#datepicker3').val()){
      if( start_day.getTime() > end_day.getTime()){
        alert('종료 날짜가 시작 날짜보다 이전입니다.');
        $(this).val('');
        return;
      }

      if(checkReservation_accom(getdateStringYYYYMMDD($('#datepicker2').val(),'-'),getdateStringYYYYMMDD($('#datepicker3').val(),'-')) == 0){
        $('#message').removeClass('alert-danger');
        $('#message').addClass('alert-success');
        $('#message').html('예약이 가능합니다.');
        $('#message').fadeIn();
        return;
      }else{
        $('#message').removeClass('alert-success');
        $('#message').addClass('alert-danger');
        $('#message').html('예약이 불가능합니다.');
        $('#message').fadeIn();
        return;
      }
    }
  };


  var checkReservation_accom = function(start_day,end_day){
    var reservations = reservation_info.filter(function(reservation){
      if( start_day >= reservation.start_day && start_day <= reservation.end_day){
        return true;
      }
      if( end_day >= reservation.start_day && end_day <= reservation.end_day){
        return true;
      }
      if(start_day <= reservation.start_day && end_day >= reservation.end_day){
        return true;
      }
      if(start_day >= reservation.start_day && end_day <= reservation.end_day){
        return true;
      }
      return false;
    });

    return reservations.length;
  }
  /*
  * ROOM INFO MODULE INIT
  */
  var init = function(){
    room_id = getRoomIdFromURL();
    getRoomInfo(room_id);
    getReservation(room_id);

    $('#message').hide();
    $('#room-reservation').click(onClick_reservation);
    $('#room-starttime').change(onChange_starttime);
    $('#room-endtime').change(onchange_endtime);
    $('#datepicker').change(onChange_datepicker);
    $('#datepicker2').change(onChange_datepicker2);
    $('#datepicker3').change(onChange_datepicker3);
  };

  return {
    init : init,
    room_id : room_id
  };
})();

$(document).ready(RoomInfo.init());
