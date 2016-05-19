var SearchTab_Accommodation = (function(){
  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '-' + month + '-' + date;
  };

  var getdateStringYYYYMMDD = function(string){
    if( !string ){
      return null;
    }
    return string.split('/')[2] + "-" + string.split('/')[0] + "-" + string.split('/')[1];
  };

  var onClick_submit = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker').val());
    var endday = getdateStringYYYYMMDD($('#datepicker1').val());

    if( !startday){
      alert('시작 날짜를 입력해주세요.');
      return;
    }

    if( !endday ){
      alert('종료 날짜를 입력해주세요.');
       return;
    }

    if( startday > endday){
      alert('종료 날짜가 시작 날짜보다 이전입니다.');
      return;
    }

    location.href="/search?type=숙박&start_day="+startday+"&end_day="+endday;
  };

  var onChange_datepicker = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker').val());
    var today = getTodayDateString();
    if(today > startday){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker').val('');
    }
  };

  var onChange_datepicker1 = function(){
    var endday = getdateStringYYYYMMDD($('#datepicker1').val());
    var today = getTodayDateString();
    if(today > endday){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker1').val('');
    }
  };
  var init = function(){
    $('#datepicker').change(onChange_datepicker);
    $('#datepicker1').change(onChange_datepicker1);
    $('#accomodation-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();
$(document).ready(SearchTab_Accommodation.init());

var SearchTab_MeetingRoom = (function(){
  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '-' + month + '-' + date;
  };

  var getdateStringYYYYMMDD = function(string){
    if( !string ){
      return null;
    }
    return string.split('/')[2] + "-" + string.split('/')[0] + "-" + string.split('/')[1];
  };

  var onClick_submit = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker2').val());
    var starttime = $('#meetingroom-starttime').val();
    var endtime = $('#meetingroom-endtime').val();

    if( !startday ){
      alert('예약 날짜를 입력주세요.');
      return;
    }

    if( !starttime ){
      alert('시작 시간를 입력해주세요.');
      return;
    }

    if( !endtime ){
      alert('종료 시간을 입력해주세요.');
      return;
    }

    if( starttime >= endtime ){
      alert('종료 시간이 시작 시간과 동일하거나 이전입니다.');
      return;
    }
    location.href="/search?type=회의실&start_day="+startday+"&start_time="+starttime+"&end_time="+endtime;
  };

  var onChange_datepicker2 = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker2').val());
    var today = getTodayDateString();
    if(today > startday){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker2').val('');
    }
  };

  var init = function(){
    $('#datepicker2').change(onChange_datepicker2);
    $('#meetingroom-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();
$(document).ready(SearchTab_MeetingRoom.init());

var SearchTab_Auditorium = (function(){
  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '-' + month + '-' + date;
  };

  var getdateStringYYYYMMDD = function(string){
    if( !string ){
      return null;
    }
    return string.split('/')[2] + "-" + string.split('/')[0] + "-" + string.split('/')[1];
  };

  var onClick_submit = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker3').val());
    var starttime = $('#auditorium-starttime').val();
    var endtime = $('#auditorium-endtime').val();

    if( !startday ){
      alert('예약 날짜를 입력주세요.');
      return;
    }

    if( !starttime ){
      alert('시작 시간를 입력해주세요.');
      return;
    }

    if( !endtime ){
      alert('종료 시간을 입력해주세요.');
      return;
    }

    if( starttime >= endtime ){
      alert('종료 시간이 시작 시간과 동일하거나 이전입니다.');
      return;
    }
    location.href="/search?type=강당&start_day="+startday+"&start_time="+starttime+"&end_time="+endtime;
  };

  var onChange_datepicker3 = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker3').val());
    var today = getTodayDateString();
    if(today > startday){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker3').val('');
    }
  };

  var init = function(){
    $('#datepicker3').change(onChange_datepicker3);
    $('#auditorium-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();
$(document).ready(SearchTab_Auditorium.init());

var SearchTab_StudyRoom = (function(){
  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '-' + month + '-' + date;
  };

  var getdateStringYYYYMMDD = function(string){
    if( !string ){
      return null;
    }
    return string.split('/')[2] + "-" + string.split('/')[0] + "-" + string.split('/')[1];
  };

  var onClick_submit = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker4').val());
    var starttime = $('#studyroom-starttime').val();
    var endtime = $('#studyroom-endtime').val();

    if( !startday ){
      alert('예약 날짜를 입력주세요.');
      return;
    }

    if( !starttime ){
      alert('시작 시간를 입력해주세요.');
      return;
    }

    if( !endtime ){
      alert('종료 시간을 입력해주세요.');
      return;
    }

    if( starttime >= endtime ){
      alert('종료 시간이 시작 시간과 동일하거나 이전입니다.');
      return;
    }
    location.href="/search?type=공부방&start_day="+startday+"&start_time="+starttime+"&end_time="+endtime;
  };

  var onChange_datepicker4 = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker4').val());
    var today = getTodayDateString();
    if(today > startday){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker4').val('');
    }
  };

  var init = function(){
    $('#datepicker4').change(onChange_datepicker4);
    $('#studyroom-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();
$(document).ready(SearchTab_StudyRoom.init());

var SearchTab_WareHouse = (function(){
  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '-' + month + '-' + date;
  };

  var getdateStringYYYYMMDD = function(string){
    if( !string ){
      return null;
    }
    return string.split('/')[2] + "-" + string.split('/')[0] + "-" + string.split('/')[1];
  };

  var onClick_submit = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker5').val());
    var starttime = $('#warehouse-starttime').val();
    var endtime = $('#warehouse-endtime').val();

    if( !startday ){
      alert('예약 날짜를 입력주세요.');
      return;
    }

    if( !starttime ){
      alert('시작 시간를 입력해주세요.');
      return;
    }

    if( !endtime ){
      alert('종료 시간을 입력해주세요.');
      return;
    }

    if( starttime >= endtime ){
      alert('종료 시간이 시작 시간과 동일하거나 이전입니다.');
      return;
    }
    location.href="/search?type=창고&start_day="+startday+"&start_time="+starttime+"&end_time="+endtime;
  };

  var onChange_datepicker5 = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker5').val());
    var today = getTodayDateString();
    if(today > startday){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker5').val('');
    }
  };

  var init = function(){
    $('#datepicker5').change(onChange_datepicker5);
    $('#warehouse-submit').click(onClick_submit);
  };

  return {
    init : init
  };
})();
$(document).ready(SearchTab_WareHouse.init());
