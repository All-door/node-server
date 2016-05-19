var Mypage = (function(){

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

  var Render = function(user){
    $('#mypage-name').html(user.name);
    $('#mypage-email').html(user.email);
    $('#mypage-phoneNumber').html(user.phoneNumber ? user.phoneNumber : '000-000-0000');
  };

  /*
  * MY PAGE MODULE INIT
  */
  var init = function(){
    getUserInformation();
  };

  return {
    init : init
  };
})();

$(document).ready(Mypage.init());
