var socket = io.connect();
var mainView = require('./views/mainview.jsx');
var userName="";
var roomName="";

socket.on('connect', function() {
    console.log('Connected successfully to the socket.io server.');
    mainView.setUserName("YES");
});



socket.on('userInfos', function(data) {
    if (data && data.user) {
        userName=data.user;
        mainView.setUserName(data.user);
    }
    if (data && data.room) {
        roomName=data.room;
        mainView.setRoomName(data.room);
    }

});

socket.on('userslist', function(l) {
    mainView.setUsersList(l);
});

socket.on('userJoin', function(u) {
    console.log('userJoin',u);
});
socket.on('userLeave', function(u) {
    console.log('userLeave',u);
});
socket.on('roomJoined', function(r) {
    console.log('roomJoined',r);
    roomName=r;
    mainView.setRoomName(r);
});

socket.on('roomMessage', function(d) {

    mainView.newMessage(d);
});

mainView.on("sendMessage",function(t){
  socket.emit('roomMessage',{user:userName,room:roomName,content:t});
});
mainView.on("joinRoom",function(t){
  socket.emit('joinRoom',{room:t});
});
