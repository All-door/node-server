var Search = (function(){
  var SearchTemplate = '\
  <div class="col-md-12" style="margin-bottom : 10px !important;">\
    <div class="col-md-4" style="width: 370px; height: 370px; overflow: hidden; margin-bottom:10px !important; ">\
        <img src="/api/images/<%= image %>" width="270px" height="auto" alt="" class="img-responsive">\
    </div>\
    <div class="col-md-8">\
        <div class="mini-desti-title">\
            <div class="pull-left">\
                <h4><strong><%= title %></strong></h4>\
                <hr/>\
                <p class="btn btn-default btn-success"><%= type %></p>\
                <p class="btn btn-default btn-default"><%= tag %></p>\
            </div>\
            <div class="clearfix"></div>\
            <div class="mini-desti-desc" style="margin-top : 5px !important;">\
                <hr/>\
                <p><strong>설명</strong> : <%= detail %> </p>\
                <div>\
                    <%= address %>\
                    <%= time_enable %>\
                    <%= day_enable %>\
                    <%= capacity %>\
                    <hr/>\
                    <a href="/room/<%= id %>" class="btn btn-default btn-default border-radius text-right">공간정보 보러가기</a>\
                </div>\
            </div>\
        </div>\
    </div>\
    <hr class="col-md-12"/>\
  </div>';

  var offset = 0;
  var limit = 30;

  var getUrlParams = function() {
    var params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
    return params;
  };

  var getTodayDateString = function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    month = (month > 9)? month : '0' + month;
    var date = now.getDate();
    date = (date > 9)? date : '0' + date;
    return year + '-' + month + '-' + date;
  };

  var onChange_type = function(){
    var type = $(this).val();

    if(type == '숙박'){
      $('#search-tab-1').hide();
      $('#search-tab-2').show();
    }else{
      $('#search-tab-2').hide();
      $('#search-tab-1').show();
    }
  };

  var onChange_endtime = function(){
    var startime = $('#search-starttime').val();
    var endtime = $('#search-endtime').val();

    if( startime >= endtime ){
      alert('종료시간이 시작시간보다 먼저이거나 동일합니다.');
      return;
    }
  };

  var onChange_starttime = function(){
    $('#search-endtime').val($('#search-starttime').val());
  };

  var onClick_submit = function(){
    $('#loader').show();
    var type = $('#search-type').val();
    var tag = $('#search-tag').val();

    if( type == '숙박'){
      var startday = getdateStringYYYYMMDD($('#datepicker1').val());
      var endday = getdateStringYYYYMMDD($('#datepicker2').val());

      if( !startday || !endday ){
        alert('시작 날짜와 종료 날짜를 입력해주세요.');
        $('#loader').delay(200).fadeOut();
        return;
      }

      if( startday > endday){
        alert('종료 날짜가 시작 날짜보다 이전입니다.');
        $('#loader').delay(200).fadeOut();
        return;
      }

      $.ajax({
        url : '/api/search',
        method : 'GET',
        data : {
          type : type,
          tag : tag ? tag : undefined,
          start_day : startday,
          end_day : endday,
          offset : offset,
          limit : limit
        },
        success : function(data){
          Render(data.data);
        },
        error : function(reqest,status,error){
          alert('서버 오류입니다. 관리자에게 문의해주세요');
          location.href="/";
        }
      });
    }else{
      var startday = getdateStringYYYYMMDD($('#datepicker').val());
      var startime = $('#search-starttime').val();
      var endtime = $('#search-endtime').val();

      if( !startday ){
        alert('예약 날짜를 입력해주세요.');
        $('#loader').delay(200).fadeOut();
        return;
      }
      if( startime >= endtime ){
        alert('종료시간이 시작시간보다 먼저이거나 동일합니다.');
        $('#loader').delay(200).fadeOut();
        return;
      }

      $.ajax({
        url : '/api/search',
        method : 'GET',
        data : {
          type : type,
          tag : tag ? tag : undefined,
          start_day : startday,
          start_time : startime,
          end_time : endtime,
          offset : offset,
          limit : limit
        },
        success : function(data){
          Render(data.data);
        },
        error : function(reqest,status,error){
          alert('서버 오류입니다. 관리자에게 문의해주세요');
          location.href="/";
        }
      });
    }
  };

  var getdateStringYYYYMMDD = function(string){
    if( !string ){
      return null;
    }
    return string.split('/')[2] + "-" + string.split('/')[0] + "-" + string.split('/')[1];
  };

  var onChange_startday = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker1').val());
    var today = getTodayDateString();
    if( today > startday ){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker1').val('');
      return;
    }
  };

  var onChange_endday = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker1').val());
    var endday = getdateStringYYYYMMDD($('#datepicker2').val());
    var today = getTodayDateString();

    if( today > endday ){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker2').val('');
      return;
    }

    if( startday > endday){
      alert('종료 날짜가 시작 날짜보다 이전입니다.');
      $('#datepicker2').val('');
      return;
    }
  };

  var onChange_datepicker = function(){
    var startday = getdateStringYYYYMMDD($('#datepicker').val());
    var today = getTodayDateString();
    if( today > startday ){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker1').val('');
      return;
    }
  };

  var getTimeString = function(starttime,endtime){
    return starttime + " ~ " + endtime;
  };

  var getDayEnableList = function(day_enable){
    var ret = '';
    _.each(day_enable,function(day){
      ret += day + " ";
    });
    return ret;
  };

  var Render_roomspec = function(key,value){
    return '<p style="margin-bottom:0px !important;"><strong>'+ key +'</strong> : '+ value +'</p>';
  };

  var Render = function(data){
    var template = '';

    _.each(data,function(room){
      var compiled = _.template(SearchTemplate);

      if(room.type == '숙박'){
        template += compiled({
          image : room.room_images[0],
          title : room.title,
          detail : room.detail.substring(0,100) + " ....",
          type : room.type,
          tag : room.tag,
          address : Render_roomspec('공간 주소',room.address),
          time_enable : '',
          day_enable : '',
          id : room._id,
          capacity : Render_roomspec('최대 사용 인원','' + room.capacity + '명'),
        });
      }else{
        template += compiled({
          image : room.room_images[0],
          title : room.title,
          detail : room.detail.substring(0,100)+" ....",
          type : room.type,
          tag : room.tag,
          address : Render_roomspec('공간 주소',room.address),
          time_enable : Render_roomspec('예약 가능한 시간',getTimeString(room.enable_start_time,room.enable_end_time)),
          day_enable : Render_roomspec('예약 가능한 요일',getDayEnableList(room.day_enable)),
          id : room._id,
          capacity : Render_roomspec('최대 사용 인원','' + room.capacity + '명')
        });
      }
    });

    if( offset == 0 ){
      $('#search-list').html(template);
    }else{
      $('#search-list').append(template);
    }

    if(data.length == 30){
      offset += 30;
    }else{
      $('#search-more').hide();
    }
    $('#search-result').show();
    $('#loader').delay(100).fadeOut();
  };

  var isAccommodation = function(params){
    return params.hasOwnProperty('type') && params.hasOwnProperty('start_day') && params.hasOwnProperty('end_day');
  };

  var isSpace = function(params){
    return params.hasOwnProperty('type') && params.hasOwnProperty('start_day') && params.hasOwnProperty('start_time') && params.hasOwnProperty('end_time');
  };

  var datepickerFormatMMDDYYYY = function(string){
    return decodeURI(string).split('-')[1]+"/"+decodeURI(string).split('-')[2]+"/"+decodeURI(string).split('-')[0];
  };

  var checkParams = function (){
    var params = getUrlParams();
    if(isAccommodation(params)){
      // 숙박 검색
      $('#search-tab-1').hide();
      $('#search-tab-2').show();

      var datepicker1 = datepickerFormatMMDDYYYY(params.start_day);
      var datepicker2 = datepickerFormatMMDDYYYY(params.end_day);

      $('#search-type').val(decodeURI(params.type));
      $('#search-tag').val(decodeURI(params.tag));
      $('#datepicker1').val(datepicker1);
      $('#datepicker2').val(datepicker2);

      $.ajax({
        url : '/api/search',
        method : 'GET',
        data : {
          type : decodeURI(params.type),
          tag : params.tag ? decodeURI(params.tag) : undefined,
          start_day : decodeURI(params.start_day),
          end_day : decodeURI(params.end_day),
          offset : offset,
          limit : limit
        },
        success : function(data){
          Render(data.data);
        },
        error : function(request,status,error){
          console.log(request);
          alert('서버 오류입니다. 관리자에게 문의해주세요');
          location.href="/";
        }
      });
    } else if(isSpace(params)){
      // 숙박 아닌 다른 검색
      $('#search-tab-2').hide();
      $('#search-tab-1').show();

      var datepicker = datepickerFormatMMDDYYYY(params.start_day);

      $('#search-type').val(decodeURI(params.type));
      $('#search-tag').val(decodeURI(params.tag));
      $('#datepicker').val(datepicker);
      $('#search-starttime').val(decodeURI(params.start_time));
      $('#search-endtime').val(decodeURI(params.end_time));

      $.ajax({
        url : '/api/search',
        method : 'GET',
        data : {
          type : decodeURI(params.type),
          tag : params.tag ? decodeURI(params.tag) : undefined,
          start_day : decodeURI(params.start_day),
          start_time : decodeURI(params.start_time),
          end_time : decodeURI(params.end_time),
          offset : offset,
          limit : limit
        },
        success : function(data){
          Render(data.data);
        },
        error : function(reqest,status,error){
          alert('서버 오류입니다. 관리자에게 문의해주세요');
          location.href="/";
        }
      });
     }
  };

  /*
  *  SEARCH PAGE MODULE INIT
  */
  var init = function(){
    $('#search-tab-1').hide();
    $('#search-tab-2').show();
    $('#search-result').hide();

    $('#search-type').change(onChange_type);
    $('#search-endtime').change(onChange_endtime);
    $('#search-starttime').change(onChange_starttime);
    $('#datepicker').change(onChange_datepicker);
    $('#datepicker1').change(onChange_startday);
    $('#datepicker2').change(onChange_endday);
    $('#search-more').click(onClick_submit);
    $('#search-submit').click(onClick_submit);

    checkParams();
  };

  return {
    init : init
  };
})();

$(document).ready(Search.init());
