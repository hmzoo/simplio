var queryString = require('query-string');
var cipher = require('simple-cipher');
var React = require('react');
var App= require('./views/app.jsx');
var socket = io.connect();
var userName='';
var roomName='';

var users=require('./tabdb.js');
users.onUpdated=function(tab){
  console.log(tab);
  console.log(users.index);
  app.setUsers(tab);
}


if(location.hash){
  try{
   roomName=cipher.decrypt(location.hash.substr(1),'AcatInAhat');
  }catch (e){
    console.log(e);
  }
}

socket.on('connect', function() {
    console.log('Connected successfully to the socket.io server.');
    socket.emit('join');
    if(roomName){
      socket.emit('joinRoom',roomName);
    }
});
socket.on('disconnect', function() {
    console.log('Socket.io server disconnected ');
    app.setInfos("Disconnected ...");
});

socket.on('joined', function(data) {
  if(!data){return;}
  userName=data;
  app.setUserName(data);
});
socket.on('roomMessage', function(data) {
  if(!data||!data.user||!data.message){return;}
    users.add(data.user,{name:data.user});
    app.newMessage(data.user,data.message);

});
socket.on('roomJoined', function(data) {
  //if(!data){return;}
  console.log("Room joined : "+data);
  roomName=data;
  app.setRoomName(data);
  app.setEncRoomName(cipher.encrypt(data,'AcatInAhat'));
});

socket.on('userJoin', function(data) {
  if(!data){return;}
    users.add(data,{name:data});
});
socket.on('userLeave', function(data) {
  if(!data){return;}
    users.del(data.user);
});

// EVENTS
var onLeave=function(){
  console.log("leave");
  socket.emit('joinRoom','');
}
var onSubmitRoom=function(t){
  socket.emit('joinRoom',t);
}
var onSubmitMessage=function(t){
  socket.emit('roomMessage',{message:t});
}

var app = ReactDOM.render(
  <App  onSubmitMessage={onSubmitMessage} onSubmitRoom={onSubmitRoom} onLeave={onLeave}/>, document.getElementById('app'));
