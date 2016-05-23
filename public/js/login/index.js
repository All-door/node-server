var Login = (function(){
  /*
  * REGEX FOR EMAIL CHECK
  */
  var email_regex =/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

  var getUrlParams = function() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
  };

  /*
  * LOGIN BUTTON ONCLICK
  */
  var onClick_button = function(){
    $('#loader').fadeIn();

    var email = $('#login-email').val();
    var password = $('#login-password').val();

    /* EMAIL CHECK */
    if(email_regex.test(email) == false){
      $('#loader').delay(200).fadeOut();
      setTimeout(function(){
        $('#login-message').html('이메일 형식이 잘못되었습니다.');
        $('#login-message').fadeIn();
      },300);
      return;
    }

    if( email == ''){
      $('#loader').delay(200).fadeOut();
      setTimeout(function(){
        $('#login-message').html('이메일을 입력해주세요');
        $('#login-message').fadeIn();
      },300);
      return;
    }

    /* PASSWORD CHECK */
    if( password == ''){
      $('#loader').delay(200).fadeOut();
      setTimeout(function(){
        $('#login-message').html('암호를 입력해주세요.');
        $('#login-message').fadeIn();
      },300);
      return;
    }

    $.ajax({
      url : '/api/user/login',
      method : 'POST',
      dataType : 'json',
      data : {
        email : email,
        password : password
      },
      success : function(data){
        var params = getUrlParams();

        if( params.redirect ){
          location.replace("/"+params.redirect);
        }else{
          location.replace("/");
        }
      },
      error : function(request,status,error){
        $('#loader').delay(200).fadeOut();
        setTimeout(function(){
          $('#login-message').html('로그인이 실패했습니다. 이메일/비밀번호를 확인해주세요');
          $('#login-message').fadeIn();
        },300);
      }
    })
  };

  var onClick_facebook = function(){
    $('#loader').show();
  };

  /*
  * LOGIN MODULE INIT
  */
  var init = function(){
    $('#login-message').hide();
    $('#loader').hide();
    $('#login-button').click(onClick_button);
    $('#login-facebook').click(onClick_facebook);
  };

  return {
    init : init
  };
})();

$(document).ready(Login.init());
