var Topbar = (function(){

  /*
  * Session Check
  */
  var checkSession = function(){
    $.ajax({
      url : '/api/user',
      method : 'GET',
      success : function(data){
        /* Session 있을 경우 */
        $('#topbar-login').hide();
        $('#topbar-signup').hide();
      },
      error : function(request,status,error){
        /* Session 없을 경우 */
        $('#topbar-logout').hide();
        $('#topbar-mypage').hide();
        $('#topbar-favorite').hide();
      }
    });
  };

  /*
  * MAIN PAGE TOPBAR MODULE INIT
  */
  var init = function(){
    checkSession();
  };

  return {
    init : init
  };
})();

$(document).ready(Topbar.init());
