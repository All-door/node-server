var Signup = (function(){
  /*
  * REGEX FOR EMAIL CHECK
  */
  var email_regex =/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
  var PhoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;

  /*
  * LOGIN AFTER SGINUP
  */
  var login = function(email,password,callback){
    $.ajax({
      url : '/api/user/login',
      dataType : 'json',
      method : 'POST',
      data : {
        email : email,
        password : password
      },
      success : function(data){
        callback(data);
      }
    });
  };

  /*
  * ERROR MESSAGE
  */
  var error_message = function(message){
    $('#loader').delay(200).fadeOut();
    setTimeout(function(){
      $('#signup-message').html(message);
      $('#signup-message').fadeIn();
    },300);
  }

  /*
  * SIGNUP BUTTON ONCLICK
  */
  var onClick_button = function(){
    $('#loader').fadeIn();

    var email = $('#signup-email').val();
    var name = $('#signup-name').val();
    var phoneNumber = $('#signup-phoneNumber').val();
    var password1 = $('#signup-password1').val();
    var password2 = $('#signup-password2').val();

    if(email == ''){
      error_message('이메일을 입력해주세요.');
      return;
    }

    if(email_regex.test(email) == false){
      error_message('이메일 형식이 잘못되었습니다.');
      return;
    }

    if(PhoneNumberRegex.test(phoneNumber) == false){
      error_message('핸드폰 번호가 잘못되었습니다.');
      return;
    }

    if(name == ''){
      error_message('이름을 입력해주세요.');
      return;
    }

    if((password1 == '') || (password2 == '')){
      error_message('암호을 입력해주세요.');
      return;
    }

    if( password1 != password2){
      error_message('암호을 일치하지 않습니다.');
      return;
    }

    $.ajax({
      url : '/api/user/signup',
      dataType : 'json',
      method : 'POST',
      data : {
        email : email,
        name : name,
        password : password1,
        phoneNumber : phoneNumber
      },
      success : function(data){
        alert('회원가입이 완료되었습니다.');
        login(email,password1,function(data){
          location.replace("/");
        });
      },
      error : function(request,status,error){
        error_message('이미 사용중인 이메일입니다.');
      }
    })
  };

  /*
  * SIGNUP MODULE INIT
  */
  var init = function(){
    // $('#loader').hide();
    $('#signup-message').hide();
    $('#signup-button').click(onClick_button);
  };

  return {
    init : init
  };
})();

$(document).ready(Signup.init());
