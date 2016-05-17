var Search = (function(){
  var SearchTemplate = '\
  <div class="col-md-4" style="width: 370px; height: 200px; overflow: hidden; margin-bottom:10px !important;">\
      <img src="/api/images/<%= image %>" width="370px" height="auto" alt="" class="img-responsive">\
  </div>\
  <div class="col-md-8">\
      <div class="mini-desti-title">\
          <div class="pull-left">\
              <h6><%= title %></h6>\
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
                  <hr/>\
                  <a href="/room/<%= id %>" class="btn btn-default btn-default border-radius text-right">공간정보 보러가기</a>\
                  <a href="/reservation/<%= id %>" class="btn btn-default btn-deafult border-radius text-right">예약하러 가기</a>\
              </div>\
          </div>\
      </div>\
  </div>';

  var offset = 0;
  var limit = 10;

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
      var startday = $('#datepicker1').val().split('/')[2] + "-" + $('#datepicker1').val().split('/')[0] + "-" +$('#datepicker1').val().split('/')[1];
      var endday = $('#datepicker2').val().split('/')[2] + "-" + $('#datepicker2').val().split('/')[0] + "-" +$('#datepicker2').val().split('/')[1];

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
          tag : tag,
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
      var startday = $('#datepicker').val().split('/')[2] + "-" + $('#datepicker').val().split('/')[0] + "-" +$('#datepicker').val().split('/')[1];
      var startime = $('#search-starttime').val();
      var endtime = $('#search-endtime').val();

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
          tag : tag,
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

  var onChange_startday = function(){
    var startday = $('#datepicker1').val().split('/')[2] + "-" + $('#datepicker1').val().split('/')[0] + "-" +$('#datepicker1').val().split('/')[1];
    var today = getTodayDateString();
    if( today > startday ){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker1').val('');
      return;
    }
  };

  var onChange_endday = function(){
    var startday = $('#datepicker1').val().split('/')[2] + "-" + $('#datepicker1').val().split('/')[0] + "-" +$('#datepicker1').val().split('/')[1];
    var endday = $('#datepicker2').val().split('/')[2] + "-" + $('#datepicker2').val().split('/')[0] + "-" +$('#datepicker2').val().split('/')[1];
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
    var startday = $('#datepicker').val().split('/')[2] + "-" + $('#datepicker').val().split('/')[0] + "-" +$('#datepicker').val().split('/')[1];
    var today = getTodayDateString();
    if( today > startday ){
      alert('오늘 이전 날짜는 선택하실 수 없습니다.');
      $('#datepicker1').val('');
      return;
    }
  };


  var Render = function(data){
    if(data.length == 10){
      offset += 10;
    }else{
      $('#search-more').hide();
    }

    var template = '';

    _.each(data,function(room){
      var compiled = _.template(SearchTemplate);

      if(room.type == '숙박'){
        template += compiled({
          image : room.room_images[0],
          title : room.title,
          detail : room.detail.substring(0,20) + " ....",
          type : room.type,
          tag : room.tag,
          address : '<p style="margin-bottom:0px !important;"><strong>공간 주소</strong> : '+room.address+'</p>',
          time_enable : '',
          day_enable : '',
          id : room._id,
        });
      }else{
        var day_enable = '';
        _.each(room.day_enable,function(day){
          day_enable += day + " ";
        });

        template += compiled({
          image : room.room_images[0],
          title : room.title,
          detail : room.detail.substring(0,20)+" ....",
          type : room.type,
          tag : room.tag,
          address : '<p style="margin-bottom:0px !important;"><strong>공간 주소</strong> : '+room.address+'</p>',
          time_enable : '<p style="margin-bottom:0px !important;"><strong>예약 가능한 시간</strong> : '+ room.enable_start_time +" ~ " + room.enable_end_time +'</p>',
          day_enable : '<p style="margin-bottom:0px !important;"><strong>예약 가능한 시간</strong> : '+ room.enable_start_time +" ~ " + room.enable_end_time +'</p>',
          time_enable : '<p style="margin-bottom:0px !important;"><strong>예약 가능한 요일</strong> : '+ day_enable +'</p>',
          id : room._id
        });
      }
    });

    if( offset == 0 ){
      $('#search-list').html(template);
    }else{
      $('#search-list').append(template);
    }

    $('#search-result').show();
    $('#loader').delay(100).fadeOut();
  };

  var onClick_more = function(){

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

    var params = getUrlParams();
    if( params.hasOwnProperty('type') && params.hasOwnProperty('start_day') && params.hasOwnProperty('end_day') ){
      // 숙박 검색
      $('#search-tab-1').hide();
      $('#search-tab-2').show();

      var datepicker1 = decodeURI(params.start_day).split('-')[1]+"/"+decodeURI(params.start_day).split('-')[2]+"/"+decodeURI(params.start_day).split('-')[0];
      var datepicker2 = decodeURI(params.end_day).split('-')[1]+"/"+decodeURI(params.end_day).split('-')[2]+"/"+decodeURI(params.end_day).split('-')[0];

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
    } else if(params.hasOwnProperty('type') && params.hasOwnProperty('start_day') && params.hasOwnProperty('start_time') && params.hasOwnProperty('end_time') ){
      // 숙박 아닌 다른 검색
      $('#search-tab-2').hide();
      $('#search-tab-1').show();

      var datepicker = decodeURI(params.start_day).split('-')[1]+"/"+decodeURI(params.start_day).split('-')[2]+"/"+decodeURI(params.start_day).split('-')[0];
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

  return {
    init : init
  };
})();

$(document).ready(Search.init());
