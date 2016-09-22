var Dashboard = (function(){
  var user = '';
  var room_id = '';
  var room_info = '';
  var ReservationTemplate = '\
  <tr class="<%= color %>">\
    <td><%= createdAt %></td>\
    <td><%= status %></td>\
    <td><%= title %></td>\
    <td><%= start_day %></td>\
    <td><%= end_day %></td>\
    <td><%= start_time %></td>\
    <td><%= end_time %></td>\
    <td><%= totalPrice %></td>\
    <td><%= user_button %></td>\
    <td><%= cancel_button %> </td>\
  </tr>';

  var LogTemplate = '\
  <tr class="<%= color %>">\
    <td><%= createdAt %></td>\
    <td><%= pass_status %></td>\
  </tr>\
  ';

  /*
  * Session Check
  */
  var checkSession = function(){
    $.ajax({
      url : '/api/user',
      method : 'GET',
      success : function(data){
        user = data.user;
        room_id = getRoomIdFromUrl();
        getRoomInfoFromServer(room_id);
      },
      error : function(request,status,error){
        alert('로그인이 필요한 페이지입니다.');
        location.href="/login";
      }
    });
  };

  var getRoomIdFromUrl = function(){
    var url = location.href;
    var arr = url.split('/');
    var index = arr.indexOf('room')+1;
    return arr[index];
  };

  var getRoomInfoFromServer = function(room_id){
    var url = "/api/room/"+room_id;
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        room_info = data.data;
        if(room_info.user_id != user.userid){
          alert('접근 권한이 없습니다.');
          location.href="/";
        }else{
          Render(room_info);
          getStatus(room_info);
          getLog(room_info);
          getReservation(room_info);
        }
      },
      error : function(reqeust,status,error){
        location.href="/";
      }
    })
  };

  var Render = function(room_info){
    var title = room_info.title;
    $('#dashboard-title').html( title + ' <small>Dashboard</small>');

    if(!room_info.hasOwnProperty('artik_cloud_id')){
      $('#room-status').hide();
    }
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

  var getStatus = function(room_info){
    $.ajax({
      url : '/api/device/'+room_info.device_id+'/status',
      mehtod : 'GET',
      success : function(data){
        var now = new Date();
        var updateAt = new Date(data.data.updatedAt);
        if( now.getTime() - updateAt.getTime() < 1000 * 60 * 5 ){
          $('#dashboard-device').removeClass('panel-red');
          $('#dashboard-device').addClass('panel-green');
          $('#dashboard-device-status').html('디바이스의 상태 : Good');
          $('#dashboard-device-status-time').html('최근 동기화 시간 : ' + getStringFromDate(data.data.updatedAt));
        }else{
          $('#dashboard-device').removeClass('panel-green');
          $('#dashboard-device').addClass('panel-red');
          $('#dashboard-device-status').html('디바이스의 상태 : Bad');
          $('#dashboard-device-status-time').html('최근 동기화 시간 : ' + getStringFromDate(data.data.updatedAt));
        }
      },
      error : function(){
        $('#dashboard-device').removeClass('panel-green');
        $('#dashboard-device').addClass('panel-red');
        $('#dashboard-device-status').html('데이터가 존재하지 않습니다.');
        $('#dashboard-device-status-time').html('최근 동기화 시간 : 데이터가 존재하지 않습니다.');
      }
    })
  };

  var getLog = function(room_info){
    var url = '/api/device/'+room_info.device_id+'/log'
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        var log = data.data;
        if( log.length == 0){
          $('#dashboard-log-time').html('데이터가 존재하지 않습니다.');
        }else{
          var date = log[0].createdAt;
          var str = getStringFromDate(date);
          $('#dashboard-log-time').html(str + ' <small>'+ log[0].pass_status +'</small>');

          var logs = data.data.slice(0,5);
          var template = '';
          for(var i=0;i<logs.length;i++){
            var complied = _.template(LogTemplate);
            template += complied({
              color : (logs[i].pass_status == '인증 실패') ? 'danger' : '',
              createdAt : getStringFromDate(logs[i].createdAt),
              pass_status : logs[i].pass_status
            });
          }
          $('#dashboard-log').html(template);
        }
      },
      error : function(request,status,error){
        $('#dashboard-log-time').html('데이터가 존재하지 않습니다.');
      }
    });
  };

  var getReservation = function(room_info){
    var url = "/api/user/room/"+room_info._id+"/reservation";
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        ReservationRender(data.data);
      },
      error : function(request,status,error){
        location.href="/";
      }
    });
  };

  var ReservationRender = function(data){
    var template = '';
    _.each(data,function(data){
      var complied = _.template(ReservationTemplate);
      template += complied({
        createdAt : getStringFromDate(data.createdAt),
        color : data.status == '예약완료' ? '' : 'danger',
        status : data.status,
        start_day : data.start_day,
        end_day : data.room_type == '숙박' ? data.end_day : data.start_day,
        start_time : data.room_type == '숙박' ? '-' : data.start_time,
        end_time : data.room_type == '숙박' ? '-' : data.end_time,
        id : data._id,
        cancel_button : data.status != '예약완료' ? '-' : '<a id="'+ data._id +'" class="cancel btn btn-default">예약 취소</a>',
        title : data.title,
        totalPrice : data.totalPrice + '원',
        user_button : '<a id="'+ data.user_id +'" class="user btn btn-default">유저 정보</a>'
      });
    });

    $('#dashboard-reservation').html(template);
    $('.cancel').click(onClick_cancel);
    $('.user').click(onClick_user);
  };

  var onClick_cancel = function(){
    if( confirm('이 예약을 취소하시겠습니까?')){
      var id = $(this).attr('id');
      var url = "/api/user/room/"+room_info._id+"/reservation/"+id;
      $.ajax({
        url : url,
        method : 'DELETE',
        success : function(){
          alert('해당 예약이 취소가 되었습니다.');
          location.href="/mypage/room/"+room_info._id+'/dashboard';
        },
        error : function(request,status,error) {
        }
      })
    }else{

    }
  };

  var onClick_user = function(){
    $(this).click(false);
    var id = $(this).attr('id');
    var url = '/api/user/'+id;

    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        var str = ' 이름 : ' + data.user.name  +' 핸드폰 번호 : '+ ( data.user.phoneNumber != '' ? data.user.phoneNumber : "000-0000-0000");
        alert(str);
        $(this).click(onClick_user);
      }
    })
  };

  /*
  * MY PAGE DASHBOARD MODULE INIT
  */
  var init = function(){
    checkSession();
  };

  return {
    init : init
  };
})();

$(document).ready(Dashboard.init());
