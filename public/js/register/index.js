var Register = (function(){
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

  var onClick_submit = function(){
    var name = $('#register-name').val();
    var type = $('#register-type').val();
    var tag = $('#register-tag').val();
    var detail = $('#register-detail').val();
    var roomimage_1 = $("input[name=roomimage]")[0].files[0];
    var roomimage_2 = $("input[name=roomimage]")[1].files[0];
    var roomimage_3 = $("input[name=roomimage]")[2].files[0];
    var roomimage_4 = $("input[name=roomimage]")[3].files[0];
    var roomimage_5 = $("input[name=roomimage]")[4].files[0];
    var deviceid = $('#register-deviceId').val();
    var starttime = $('#register-starttime').val();
    var endtime = $('#register-endtime').val();
    var address = $('#register-address').val();
    var price = Number($('#register-price').val());
    var capacity = Number($('#register-capacity').val());
    var day = getDayList();

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

    if(!roomimage_1 && !roomimage_2 && !roomimage_3 && !roomimage_4 && !roomimage_5){
      alert('최소한 하나의 이미지는 필요합니다.');
      return;
    }

    if(!deviceid){
      alert('디바이스 ID를 입력해주세요.');
      return;
    }

    if( price < 0){
      alert('시간/하루 당 가격이 0보다 작습니다.');
      return;
    }

    if( capacity <= 0){
      alert('최대 이용 인원이 0이거나 0보다 작습니다.');
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
    formData.append('room_image',roomimage_1);
    formData.append('room_image',roomimage_2);
    formData.append('room_image',roomimage_3);
    formData.append('room_image',roomimage_4);
    formData.append('room_image',roomimage_5);
    formData.append('device_id',deviceid);
    formData.append('enable_start_time',starttime);
    formData.append('enable_end_time',endtime);
    formData.append('day_enable',JSON.stringify(day));
    formData.append('address',address);
    formData.append('price',price);
    formData.append('capacity',capacity);

    $('#loader').show();
    $.ajax({
      url : '/api/user/room',
      method : 'POST',
      processData : false,
      contentType : false,
      data : formData,
      success : function(data){
        alert("공간 등록이 완료되었습니다.");
        $('#loader').fadeOut();
        location.href="/";
      },
      error : function(request,status,error){
        alert('등록된 디바이스 정보입니다. 디바이스 정보를 확인해주세요');
        $('#loader').fadeOut();
      }
    });
  };

  /*
  * ROOM REGISTER MODULE INIT
  */
  var init = function(){
    disableDay();
    disableTime();

    $('#register-submit').click(onClick_submit);
    $('#register-type').change(onChange_type);
    $('#register-endtime').change(onChnage_endtime);
  };

  return {
    init : init
  };
})();

$(document).ready(Register.init());
