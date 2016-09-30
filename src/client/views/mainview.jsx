var React = require('react');
var SimpleChat= require('./simplechat.jsx');


var mainView = {
    on: function(actionName, action) {
        this[actionName] = action;
    },
    setUserName:function(t){
      simpleChat.setUserName(t);
    }
    ,
    setRoomName:function(t){
      simpleChat.setRoomName(t);
    },

    setInfos:function(t){
      simpleChat.setInfos(t);
    }

};

var test=function(t){
  console.log(t);
}

var simpleChat = ReactDOM.render(
  <SimpleChat onJoinRoom={test}/>, document.getElementById('chat'));



module.exports = mainView;
