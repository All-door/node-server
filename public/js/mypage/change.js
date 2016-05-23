var Change = (function(){
  var onClick_submit = function(){
    var origin = $('#change-password1').val();
    var password1 = $('#change-password2').val();
    var password2 = $('#change-password3').val();

    if( !origin ){
      alert('기존 암호를 입력해주세요.');
      return;
    }

    if( !password1 || !password2 ){
      alert('새로운 암호를 입력해주세요.');
      return;
    }

    if ( password1 != password2 ){
      alert('새로운 암호가 일치하지 않습니다.');
      return;
    }

    $.ajax({
      url : '/api/user',
      method : 'PUT',
      dataType : 'json',
      data : {
        origin_password : origin,
        change_password : password1
      },
      success : function(data){
        alert('비밀 번호가 변경되었습니다.');
        location.href = "/mypage";
      },
      error : function(request,status,error){
        alert('기존 암호가 일치하지 않습니다.');
      }
    })
  };

  var getUserInformation = function(){
    var url = "/api/user";

    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        Render(data.user);
      },
      error : function(request,status,error){
        alert('로그인이 필요한 서비스입니다.');
        location.href="/login";
      }
    });
  };

  var Render = function(data){
    if( data.hasOwnProperty('facebookId')){
      $('#change-submit').prop('disabled',true);
      $('#change-password1').prop('disabled',true);
      $('#change-password2').prop('disabled',true);
      $('#change-password3').prop('disabled',true);
    }
  };

  /*
  * MY PAGE CHANGE MODULE INIT
  */
  var init = function(){
    getUserInformation();
    $('#change-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();

$(document).ready(Change.init());


var Change_PhoneNumber = (function(){
  var PhoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;

  var getUserInformation = function(){
    var url = "/api/user";

    $.ajax({
      url : url,
      method : 'GET',
      success : function(data){
        Render(data.user);
      },
      error : function(request,status,error){
        alert('로그인이 필요한 서비스입니다.');
        location.href="/login";
      }
    });
  };

  var Render = function(data){
    var phoneNumber = data.phoneNumber ? data.phoneNumber : '000-0000-0000';
    $('#phoneNumber').val(phoneNumber);
  };

  var onClick_submit_phoneNumber = function(){
    var phoneNumber = $('#change-phoneNumber').val();

    if( PhoneNumberRegex.test(phoneNumber) == false){
      alert('핸드폰 번호가 잘못되었습니다.');
      return;
    }

    $.ajax({
      url : '/api/user',
      method : 'PUT',
      dataType : 'json',
      data : {
        phoneNumber : phoneNumber
      },
      success : function(data){
        alert('핸드폰 번호가 변경되었습니다.');
        location.href = "/mypage";
      },
      error : function(request,status,error){
        alert('서버 오류입니다. 관리자에게 문의해주세요');
        location.href = "/";
      }
    })
  }
  var init = function(){
    getUserInformation();
    $('#change-submit-phoneNumber').click(onClick_submit_phoneNumber);
  };

  return {
    init : init
  };
})();
$(document).ready(Change_PhoneNumber.init());
