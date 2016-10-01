var React = require('react');
var SimpleChat= require('./simplechat.jsx');


var mainView = {
    on: function(actionName, action) {
        this[actionName] = action;
    },
    joinRoom:function(t){},
    sendMessage:function(t){},
    
    setUserName:function(t){
      simpleChat.setUserName(t);
    }
    ,
    setRoomName:function(t){
      simpleChat.setRoomName(t);
    },

    setInfos:function(t){
      simpleChat.setInfos(t);
    },
    newMessage:function(d){
      simpleChat.newMessage(d);
    },
    setUsersList:function(l){
      simpleChat.setUsersList(l);
    }

};

var joinRoom=function(t){
  mainView.joinRoom(t);
}
var sendMessage=function(t){
  mainView.sendMessage(t);
}


var simpleChat = ReactDOM.render(
  <SimpleChat onJoinRoom={joinRoom} onSendMessage={sendMessage}/>, document.getElementById('chat'));



module.exports = mainView;
