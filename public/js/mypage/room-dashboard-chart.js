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
      $('#hall').html('');
      $('#co2').html('');
      $('#lpg').html('');
      $('#smoke').html('');

      new Morris.Line({
        element: 'co2',
        data: data.data,
        xkey: 'time',
        ykeys: ['co2'],
        labels: ['co2']
      });

      new Morris.Line({
        element: 'lpg',
        data: data.data,
        xkey: 'time',
        ykeys: ['lpg'],
        labels: ['lpg']
      });

      new Morris.Line({
        element: 'smoke',
        data: data.data,
        xkey: 'time',
        ykeys: ['smoke'],
        labels: ['smoke']
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
}, 60 * 60* 1000);
