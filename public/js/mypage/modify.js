var ModifyRoom = (function(){
  var room_id = '';

  var count_image = 0;
  var delete_images = [];

  var imageTemplate = '\
  <div class="<%= cls %>">\
    <div class="center-block" style="width: 370px; height: 185px; overflow: hidden; margin-bottom:10px !important;">\
      <img id="<%= id %> class="room_image center-block" width="auto" height="185px" src="/api/images/<%= url %>">\
    </div>\
  </div>';

  var blankTemplate = '\
  <div class="col-sm-5">\
    <div class="center-block" style="width: 370px; height: 185px; overflow: hidden; margin-bottom:10px !important;">\
    </div>\
  </div>'

  var disableTime = function(){
    $('#register-starttime').prop('disabled',true);
    $('#register-endtime').prop('disabled',true);
  };

  var enableTime = function() {
    $('#register-starttime').prop('disabled',false);
    $('#register-endtime').prop('disabled',false);
  };

  var disableDay = function(){
    $('#register-enableday-mon').prop('disabled',true);
    $('#register-enableday-tue').prop('disabled',true);
    $('#register-enableday-wed').prop('disabled',true);
    $('#register-enableday-thu').prop('disabled',true);
    $('#register-enableday-fri').prop('disabled',true);
    $('#register-enableday-sat').prop('disabled',true);
    $('#register-enableday-sun').prop('disabled',true);
  };
  var enableDay = function(){
    $('#register-enableday-mon').prop('disabled',false);
    $('#register-enableday-tue').prop('disabled',false);
    $('#register-enableday-wed').prop('disabled',false);
    $('#register-enableday-thu').prop('disabled',false);
    $('#register-enableday-fri').prop('disabled',false);
    $('#register-enableday-sat').prop('disabled',false);
    $('#register-enableday-sun').prop('disabled',false);
  };

  var getDayList = function(){
    var list = [];
    if($('#register-enableday-mon').is(':checked')){
      list.push($('#register-enableday-mon').val());
    }
    if($('#register-enableday-tue').is(':checked')){
      list.push($('#register-enableday-tue').val());
    }
    if($('#register-enableday-wed').is(':checked')){
      list.push($('#register-enableday-wed').val());
    }
    if($('#register-enableday-thu').is(':checked')){
      list.push($('#register-enableday-thu').val());
    }
    if($('#register-enableday-fri').is(':checked')){
      list.push($('#register-enableday-fri').val());
    }
    if($('#register-enableday-sat').is(':checked')){
      list.push($('#register-enableday-sat').val());
    }
    if($('#register-enableday-sun').is(':checked')){
      list.push($('#register-enableday-sun').val());
    }
    return list;
  };

  var onChange_type = function(){
    var type = $('#register-type').val();
    if(type == '숙박'){
      disableDay();
      disableTime();
    }else{
      enableDay();
      enableTime();
    }
  };

  var onChnage_endtime = function(){
    var starttime = $('#register-starttime').val();
    var endtime = $('#register-endtime').val();

    if( endtime < starttime){
      alert("이용 종료시간이 이용 가능 시간보다 앞서있습니다.");
    }
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
          location.href = '/mypage/room';
        }
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리지에게 문의해주세요.');
        location.href = '/';
      }
    });
  }

  var onClick_submit = function(){
    var name = $('#register-name').val();
    var type = $('#register-type').val();
    var tag = $('#register-tag').val();
    var detail = $('#register-detail').val();
    var starttime = $('#register-starttime').val();
    var endtime = $('#register-endtime').val();
    var address = $('#register-address').val();
    var day = getDayList();
    var roomimage_1 = $("input[name=roomimage]")[0].files[0];
    var roomimage_2 = $("input[name=roomimage]")[1].files[0];
    var roomimage_3 = $("input[name=roomimage]")[2].files[0];
    var roomimage_4 = $("input[name=roomimage]")[3].files[0];
    var roomimage_5 = $("input[name=roomimage]")[4].files[0];

    if(!name){
      alert('공간 이름을 입력해주세요.');
      return;
    }

    if(!address){
      alert('공간 주소를 입력해주세요.');
      return;
    }

    if(!detail){
      alert('내용을 입력해주세요.');
      return;
    }

    if(endtime < starttime){
      alert('이용 종료 시간이 이용 시작 시간보다 앞섭니다.');
      return;
    }

    if(type != '숙박' && day.length == 0){
      alert('사용 가능 요일을 입력해주세요.');
      return;
    }

    if( (count_image - delete_images.length) == 0 && ( !roomimage_1 && !roomimage_2 && !roomimage_3 && !roomimage_4 && !roomimage_5)){
      alert('적어도 하나의 이미지는 필요합니다.');
      return;
    }

    if(type == '숙박'){
      starttime = '24:00';
      endtime = '24:00';
      day = ['월','화','수','목','금','토','일'];
    }

    var formData = new FormData();
    formData.append('title',name);
    formData.append('detail',detail);
    formData.append('type',type);
    formData.append('tag',tag);
    formData.append('enable_start_time',starttime);
    formData.append('enable_end_time',endtime);
    formData.append('day_enable',JSON.stringify(day));
    formData.append('address',address);
    formData.append('add_image',roomimage_1);
    formData.append('add_image',roomimage_2);
    formData.append('add_image',roomimage_3);
    formData.append('add_image',roomimage_4);
    formData.append('add_image',roomimage_5);
    formData.append('delete_images',JSON.stringify(delete_images));

    $('#loader').show();
    $.ajax({
      url : '/api/user/room/'+room_id,
      method : 'PUT',
      processData : false,
      contentType : false,
      data : formData,
      success : function(data){
        alert("공간 수정이 완료되었습니다.");
        $('#loader').fadeOut();
        location.href="/mypage/room";
      },
      error : function(request,status,error){
        alert('존재하지 않는 공간입니다.');
        $('#loader').fadeOut();
        location.href="/mypage/room"
      }
    });
  };

  var onClick_image = function(){
    var id = $(this).attr('id');
    if(id){
      if( $(this).hasClass('removed_image') ){
        if(confirm('삭제를 취소하시겠습니까?')){
          $(this).removeClass('removed_image');
          delete_images.splice(id,1);
        }
      }else{
        if(confirm('이 이미지를 삭제하시겠습니까?')){
          $(this).addClass('removed_image');
          delete_images.push(id);
        }
      }
    }
  };

  var Render = function(room){
    $('#register-name').val(room.title);
    $('#register-type').val(room.type);
    $('#register-tag').val(room.tag);
    $('#register-address').val(room.address);
    $('#register-detail').val(room.detail);
    $('#register-deviceId').val(room.device_id);

    if( room.type != '숙박'){
      $('#register-starttime').val(room.enable_start_time);
      $('#register-endtime').val(room.enable_end_time);

      var day = room.day_enable;
      if( day.indexOf('월') > -1){
        $('#register-enableday-mon').prop('checked',true);
      }
      if( day.indexOf('화') > -1){
        $('#register-enableday-tue').prop('checked',true);
      }
      if( day.indexOf('수') > -1){
        $('#register-enableday-wed').prop('checked',true);
      }
      if( day.indexOf('목') > -1){
        $('#register-enableday-thu').prop('checked',true);
      }
      if( day.indexOf('금') > -1){
        $('#register-enableday-fri').prop('checked',true);
      }
      if( day.indexOf('토') > -1){
        $('#register-enableday-sat').prop('checked',true);
      }
      if( day.indexOf('일') > -1){
        $('#register-enableday-sun').prop('checked',true);
      }
    }else{
      disableDay();
      disableTime();
    }

    var images = room.room_images;
    var length = room.room_images.length;
    count_image = length;
    var template = '';

    for(var i=0;i<length;i++){
      if( (i!=0) && ((i%2)==0)){
        var compiled = _.template(imageTemplate);
        template += compiled({
          cls : "col-sm-offset-2 col-sm-5",
          id : room.room_images[i],
          url : room.room_images[i]
        });
      }else{
        var compiled = _.template(imageTemplate);
        template += compiled({
          cls : "col-sm-5",
          id : room.room_images[i],
          url : room.room_images[i]
        });
      }
    }
    if( length % 2 == 1){
      template += blankTemplate;
    }

    $('#images').html(template);
    $('img').click(onClick_image);
  };

  /*
  * MY PAGE MODIFY ROOM MODULE INIT
  */
  var init = function(){
    room_id = getRoomIdFromURL();
    getRoomInfo(room_id);

    $('#register-type').change(onChange_type);
    $('#register-endtime').change(onChnage_endtime);
    $('#register-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();

$(document).ready(ModifyRoom.init());
