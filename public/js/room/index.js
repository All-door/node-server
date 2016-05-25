var RoomInfo = (function(){
  var room_id = '';
  var imageTemplate = '\
  <div class="room_image_padding col-md-4" style="width: 370px; height: 185px; overflow: hidden; margin-bottom:10px !important;">\
    <img class="center-block" id="<%= image %>" src="/api/images/<%= image %>" height="185px" width="auto">\
  </div>';

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
    return link[index];
  };

  var getRoomInfo = function(room_id){
    var url = "/api/room/"+room_id;
    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        if(data.data != null){
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

  var onClick_image = function(){
    var id = $(this).attr('id');
    $('#room-modal-image').prop('src','/api/images/'+id);
    $('#imageModal').modal({
      keyboard: false
    })
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
    }else{
      $('#room-enabletime').hide();
      $('#room-enableday').hide();
      $('#room-price').html('<strong>시간 당 가격 : </strong> '+room.price + '원');
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
    location.href= '/reservation/'+room_id;
  };

  /*
  * ROOM INFO MODULE INIT
  */
  var init = function(){
    room_id = getRoomIdFromURL();
    getRoomInfo(room_id);

    $('#room-reservation').click(onClick_reservation);
  };

  return {
    init : init,
    room_id : room_id
  };
})();

$(document).ready(RoomInfo.init());
