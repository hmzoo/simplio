var express = require('express');
var helmet = require('helmet');
var app = express();
var server = require('http').Server(app);

var Session = require('express-session');
var RedisStore = require('connect-redis')(Session);
var session = Session({
    store: new RedisStore(),
    key: 'jsessionid',
    secret: 'simplioSecret',
    resave: true,
    saveUninitialized: true
});

app.use(helmet());
app.use(session);
app.use(express.static(__dirname + '/dist'));

server.listen(8080);
console.log("Server started, listening on 8080 ...");

var db = require("./db.js");
var ps = require("./ps.js");

//IO
var socketio = require('socket.io');
var ios = require('socket.io-express-session');
var io = socketio.listen(server);
io.use(ios(session, {
    autoSave: true
}));

io.on('connection', function(client) {
    console.log('Client connected ' + client.id);
    if (!client.handshake.session) {
        console.log('Client session error ' + client.id);
        return;
    }

    client.on('disconnect', function() {
        console.log('Client disconnected ' + client.id);
        db.leave(client.id);
    });

    client.on('nameRequest', function(name) {
        console.log('Name request from' + client.id);
        if (!client.handshake.session.user) {
            db.join(client.id);
            return;
        }
        console.log("updating client " + client.handshake.session.user);
        db.joinagain(client.id, client.handshake.session.user);

    });

    client.on('roomRequest', function(data) {
        if (!data || !data.room) {
            return;
        }
        db.joinRoom(client.id, data.room);
        console.log('Room request from' + client.id + ":" + data.room);
    });

    client.on('roomMessage', function(data) {
        if (!data || !data.message) {
            return;
        }
        db.roomMessage(client.id,data.message);
        console.log('Room message from' + client.id + ":" + data.message);
    });

});


//DB

db.onNameAttribued = function(sids, name) {
    console.log("nameAttribued", sids, name);
    for (sid of sids) {
        var s = io.sockets.connected[sid];
        if (!s || !s.handshake.session) {
            return;
        }
        s.handshake.session.user = name;
        s.handshake.session.save();
        s.emit("nameAttribued", {
            name: name
        });
    }
}

db.onUserJoin = function(sid, room, name, users) {
    console.log("userJoin", room, name);
    var s = io.sockets.connected[sid];
    if (!s || !s.handshake.session) {
        return;
    }
    s.join(room);
    s.emit("roomJoined", {
        room: room,
        users: users
    });
    ps.pub("userJoin",{name:name,room:room});

}
db.onUserLeave = function(sid, room, name) {
    console.log("userLeave", room, name);
    var s = io.sockets.connected[sid];
    if (s) {
        s.leave(room);
    }
    ps.pub("userLeave",{name:name,room:room});

}
db.onRoomMessage = function( room, name,message) {

    ps.pub("roomMessage",{name:name,room:room,message:message});

}



//PUBSUB

ps.on("roomMessage", function(data) {
  console.log("roomMessage",data);
    io.sockets.in(data.room).emit("roomMessage", {name:data.name,message:data.message});
});
ps.on("userJoin", function(data) {
  console.log("userJoin",data);
    io.sockets.in(data.room).emit("userJoin", {name:data.name});
});
ps.on("userLeave", function(data) {
  console.log("userLeave",data);
    io.sockets.in(data.room).emit("userLeave", {name:data.name});
});
