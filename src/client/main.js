var socket = io.connect();
var mainView = require('./views/mainview.jsx');

socket.on('connect', function() {
    console.log('Connected successfully to the socket.io server.');
    mainView.setUserName("YES");
});

socket.on('ok', function(msg) {

    console.log("ok", msg);
});

socket.on('userInfos', function(data) {
    if (data && data.name) {
        mainView.setUserName(data.name);
    }
    if (data && data.room) {
        mainView.setRoomName(data.room);
    }

});
