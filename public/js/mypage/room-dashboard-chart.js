new Morris.Line({
  element: 'temp',
  data: [
    { temp: '26.3', humi: '10%', time: '2016-09-22 13:00:00' },
    { temp: '26.7', humi: '55%', time: '2016-09-22 13:01:00' },
    { temp: '27.8', humi: '100%', time: '2016-09-22 13:02:00' },
    { temp: '25.7', humi: '60%', time: '2016-09-22 13:03:00' },
    { temp: '26.7', humi: '90%', time: '2016-09-22 13:04:00' }
  ],
  xkey: 'time',
  ykeys: ['temp'],
  labels: ['온도']
});

new Morris.Line({
  element: 'humi',
  data: [
    { temp: '26.3', humi: '10%', time: '2016-09-22 13:00:00' },
    { temp: '26.7', humi: '55%', time: '2016-09-22 13:01:00' },
    { temp: '27.8', humi: '100%', time: '2016-09-22 13:02:00' },
    { temp: '25.7', humi: '60%', time: '2016-09-22 13:03:00' },
    { temp: '26.7', humi: '90%', time: '2016-09-22 13:04:00' }
  ],
  xkey: 'time',
  ykeys: ['humi'],
  labels: ['습도']
});

new Morris.Line({
  element: 'hall',
  data: [
    { hall: 1, time: '2016-09-22 13:00:00' },
    { hall: 0, time: '2016-09-22 13:01:00' },
    { hall: 1, time: '2016-09-22 13:02:00' },
    { hall: 0, time: '2016-09-22 13:03:00' },
    { hall: 0, time: '2016-09-22 13:04:00' }
  ],
  xkey: 'time',
  ykeys: ['hall'],
  labels: ['열림 상태'],
  numLines: 2,
  smooth: false
});
