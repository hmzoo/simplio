var React = require('react');
var SimpleChat= require('./views/simplechat.jsx');
var socket = io.connect();
var userName='';
var roomName='';

socket.on('connect', function() {
    console.log('Connected successfully to the socket.io server.');
    socket.emit('nameRequest');
    if(roomName){
      socket.emit('roomRequest',{room:roomName});
    }
});
socket.on('disconnect', function() {
    console.log('Socket.io server disconnected ');
    cleanRoom();
    setInfos("Disconnected ...");
});

socket.on('nameAttribued', function(data) {

  if(!data||!data.name){return;}
    setUserName(data.name);
});
socket.on('roomMessage', function(data) {
  if(!data||!data.name||!data.message){return;}
    newMessage(data.name,data.message);
    addUser(data.name);
});
socket.on('roomJoined', function(data) {
  if(!data||!data.room){return;}
  console.log("Room joined : "+data.room);
  cleanRoom();
    setRoomName(data.room);
    if(data.users){
      for (u of data.users) {
        addUser(u);
      }
    }
});
socket.on('userJoin', function(data) {
  if(!data||!data.name){return;}
    addUser(data.name);
});
socket.on('userLeave', function(data) {
  if(!data||!data.name){return;}
    removeUser(data.name);
});


test=function(){
  console.log("TEST");
  simpleChat.setRoomName("OK");
  simpleChat.setUserName("20222");
  simpleChat.newMessage("33445","Hello");
  simpleChat.addUser("33333");
  simpleChat.removeUser("12345");
}
var setUserName=function(t){
  if(t==userName){return;}
  userName=(t);
  simpleChat.setUserName(t);

}
var setInfos=function(t){

  simpleChat.setInfos(t);
}
var setRoomName=function(t){
  roomName=(t);
  simpleChat.setRoomName(t);
}
var newMessage=function(u,t){
  simpleChat.newMessage(u,t);
}
var cleanRoom=function(){
  simpleChat.cleanRoom();
}
var addUser=function(u){
  simpleChat.addUser(u);
}
var removeUser=function(u){
  simpleChat.removeUser(u);
}

var onSubmitRoomForm=function(t){
  socket.emit('roomRequest',{room:t});
}
var onSubmitMessageForm=function(t){
  socket.emit('roomMessage',{message:t});
}

var simpleChat = ReactDOM.render(
  <SimpleChat onSubmitRoomForm={onSubmitRoomForm} onSubmitMessageForm={onSubmitMessageForm}/>, document.getElementById('simplechat'));
