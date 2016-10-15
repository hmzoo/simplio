var queryString = require('query-string');
var cipher = require('simple-cipher');
var React = require('react');
var App= require('./views/app.jsx');
var socket = io.connect();
var userName='';
var roomName='';

var TAFFY = require('taffy');
var users=TAFFY();


if(location.hash){
  try{
   roomName=cipher.decrypt(location.hash.substr(1),'AcatInAhat');
  }catch (e){
    console.log(e);
  }
}

socket.on('connect', function() {
    console.log('Connected successfully to the socket.io server.');
    socket.emit('nameRequest');
    if(roomName){
      socket.emit('roomRequest',{room:roomName});
    }
});
socket.on('disconnect', function() {
    console.log('Socket.io server disconnected ');
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
    setRoomName(data.room);
    if(data.users){
      for (u of data.users) {
        addUser(u);
      }
    }
});
socket.on('roomLeft', function(data) {

  console.log("Room left");
    setRoomName('');

});
socket.on('userJoin', function(data) {
  if(!data||!data.name){return;}
    addUser(data.name);
});
socket.on('userLeave', function(data) {
  if(!data||!data.name){return;}
    removeUser(data.name);
});



var setUserName=function(t){
  if(t==userName){return;}
  userName=(t);
  app.setUserName(t);

}
var setInfos=function(t){

  app.setInfos(t);
}
var setRoomName=function(t){
  roomName=(t);
  app.setRoomName(t);
  app.setEncRoomName(cipher.encrypt(t,'AcatInAhat'));
}
var newMessage=function(u,t){
  app.newMessage(u,t);
}
var clean=function(){
  app.clean();
}
var addUser=function(u){
  users.insert({id:u,infos:"OK"});
  console.log(users.get());
  app.addUser(u);
}
var removeUser=function(u){
  app.removeUser(u);
}
var onLeave=function(){
  console.log("leave");
  socket.emit('roomRequest',{room:''});
}
var onSubmitRoom=function(t){
  socket.emit('roomRequest',{room:t});
}
var onSubmitMessage=function(t){
  socket.emit('roomMessage',{message:t});
}

var app = ReactDOM.render(
  <App  onSubmitMessage={onSubmitMessage} onSubmitRoom={onSubmitRoom} onLeave={onLeave}/>, document.getElementById('app'));
