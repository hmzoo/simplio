var socket = io.connect();
var mainView = require('./views/mainview.jsx');

socket.on('connect', function() {
    console.log('Connected successfully to the socket.io server.');
    setInterval(function(){
    socket.emit('test', 'Testing ');
    console.log(test);
  }, 500);
});
