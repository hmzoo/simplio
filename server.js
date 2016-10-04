var express = require('express');
var helmet = require('helmet');
var app = express();
var server = require('http').Server(app);

var Session = require('express-session');
var RedisStore=require('connect-redis')(Session);
var session=Session({store:new RedisStore(), key:'jsessionid', secret:'simplioSecret', resave:true,saveUninitialized:true});

app.use(helmet());
app.use(session);
app.use(express.static(__dirname + '/dist'));

server.listen(8080);
console.log("Server started, listening on 8080 ...");

var socketio = require('socket.io');
var ios = require('socket.io-express-session');
var io = socketio.listen(server);
io.use(ios(session, {autoSave: true}));

io.on('connection', function(client) {
    console.log('Client connected ' + client.id);
    if (!client.handshake.session) {
      console.log('Client session error ' + client.id);
      return;
    }

    client.on('disconnect', function() {
        console.log('Client disconnected ' + client.id);
    });

    client.on('nameRequest', function(name) {
        console.log('Name request from' + client.id);
        if (!client.handshake.session.user) {
          db.newClient(client.id);
          return;
        }
        console.log("updating client "+client.handshake.session.user);
        db.updateClient(client.id,client.handshake.session.user);

    });

    client.on('roomRequest', function(data) {
        if (!data || !data.room) {
            return;
        }
        console.log('Room request from' + client.id + ":" + data.room);
    });

    client.on('roomMessage', function(data) {
        if (!data || !data.message) {
            return;
        }
        console.log('Room message from' + client.id + ":" + data.message);
    });

});


var sender = {
    sendNameAtribued(sid, name) {
      var s = io.sockets.connected[sid];
      if (!s||!s.handshake.session) {return ;}    
        s.handshake.session.user = name;
        s.handshake.session.save();
        s.emit("nameAttribued", {
            name: name
        });
    }


};


var db = require("./db.js")(sender);
