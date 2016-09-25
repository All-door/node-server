var getRoomIdFromUrl = function(){
  var url = location.href;
  var arr = url.split('/');
  var index = arr.indexOf('room')+1;
  return arr[index];
};

var id = '';
var accessToken = '';
var room_id = getRoomIdFromUrl();


var getRoomInfoFromServer = function(room_id){
  var url = "/api/room/"+room_id+"/artik";
  $.ajax({
    url : url,
    method : 'GET',
    success : function(data){
      $('#temp').html('');
      $('#humi').html('');
      $('#hall').html('');

      new Morris.Line({
        element: 'temp',
        data: data.data,
        xkey: 'time',
        ykeys: ['temp'],
        labels: ['온도']
      });

      new Morris.Line({
        element: 'humi',
        data: data.data,
        xkey: 'time',
        ykeys: ['humi'],
        labels: ['습도']
      });

      new Morris.Line({
        element: 'hall',
        data: data.data,
        xkey: 'time',
        ykeys: ['hall'],
        labels: ['열림 상태'],
        numLines: 2,
        smooth: false
      });

    },
    error : function(reqeust,status,error){
    }
  });
};
getRoomInfoFromServer(room_id);

setInterval(function(){
  getRoomInfoFromServer(room_id);
},10* 1000);
