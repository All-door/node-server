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
        location.href = "/";
      },
      error : function(request,status,error){
        alert('기존 암호가 일치하지 않습니다.');
      }
    })
  };

  /*
  * MY PAGE CHANGE MODULE INIT
  */
  var init = function(){
    console.log("MY PAGE CHANGE MODULE INIT");
    $('#change-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();

$(document).ready(Change.init());
