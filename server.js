var cfEnv = require("cfenv");
var appEnv = cfEnv.getAppEnv();
var ridserver = (Math.floor(Math.random() * 900) + 100).toString();
var clog = function(act, t) {
    console.log(ridserver, act, t);
}

var express = require('express');
var helmet = require('helmet');
var app = express();
var server = require('http').Server(app);

var Session = require('express-session');
var rc = require("./rc.js");
var RedisStore = require('connect-redis')(Session);
var sessionStore = new RedisStore({client: rc()});
var session = Session({store: sessionStore, key: 'JSESSIONID', secret: 'simplioSecret', resave: true, saveUninitialized: true});

app.use(helmet());
app.use(session);
app.use(express.static(__dirname + '/dist'));

server.listen(appEnv.port);
clog("Server started", "listening on " + appEnv.bind + " port: " + appEnv.port + " ...");

var db = require("./db.js");
var ps = require("./ps.js");

//IO
var socketio = require('socket.io');
var ios = require('socket.io-express-session');
//var cookieParser=require('socket.io-cookie-parser');

var io = socketio.listen(server);
var SessionSockets = require('session.socket.io');
//var sessionSockets=new SessionSockets(io,sessionStore,cookieParser,'jsessionid');
//io.use(cookieParser('simplioSecret'));
io.use(ios(session));

io.on('connection', function(client) {
    clog('CL:Client connected', client.id);
    /*
    console.log('----------------');
    console.log(ridserver);
    console.log('----------------');
    console.log(client.handshake.headers);
    console.log('----------------');
    */
    if (!client.handshake.session) {
        clog('CL:Client session error', client.id);
        return;
    }
    checksids();

    client.on('disconnect', function() {
        clog('CL:Client disconnected', client.id);
        db.leave(client.id);
    });

    client.on('nameRequest', function(name) {
        clog('CL:Name request from', client.id);
        if (!client.handshake.session.user) {
            db.join(client.id);
            return;
        }
        clog("CL:updating client ", client.handshake.session.user);
        db.joinagain(client.id, client.handshake.session.user);

    });

    client.on('roomRequest', function(data) {
        if (!data || !data.room) {
            return;
        }
        db.joinRoom(client.id, data.room);
        clog('CL:Room request', 'from' + client.id + ":" + data.room);
    });

    client.on('roomMessage', function(data) {
        if (!data || !data.message) {
            return;
        }
        db.roomMessage(client.id, data.message);
        clog('CL:Room message', 'from' + client.id + ":" + data.message);
    });

});
//TIMER
var checksids = function() {
//  console.log(io.sockets.connected);
  if(io.sockets.connected===undefined){return;}
    for (s in io.sockets.connected) {
        clog("socket", s,io.sockets.connected[s].connected);
    }

}

//DB

db.onNameAttribued = function(sids, name) {
   clog("DB:nameAttribued", name);
    for (sid of sids) {
        var s = io.sockets.connected[sid];
        if (!s || !s.handshake.session) {
            return;
        }
        s.handshake.session.user = name;
        s.handshake.session.save();
        s.emit("nameAttribued", {name: name});
    }
}

db.onUserJoin = function(sid, room, name, users) {
    clog("DB:userJoin", room + " " + name);
    var s = io.sockets.connected[sid];
    if (!s || !s.handshake.session) {
        return;
    }
    s.join(room);
    s.emit("roomJoined", {
        room: room,
        users: users
    });
    ps.pub("userJoin", {
        name: name,
        room: room
    });

}
db.onUserLeave = function(sid, room, name) {
    clog("DB:userLeave", room + ' ' + name);
    var s = io.sockets.connected[sid];
    if (s) {
        s.leave(room);
    }
    ps.pub("userLeave", {
        name: name,
        room: room
    });

}
db.onRoomMessage = function(room, name, message) {

    ps.pub("roomMessage", {
        name: name,
        room: room,
        message: message
    });

}

//PUBSUB

ps.on("roomMessage", function(data) {
    clog("PS:roomMessage", data);
    io.sockets. in(data.room).emit("roomMessage", {
        name: data.name,
        message: data.message
    });
});
ps.on("userJoin", function(data) {
    clog("PS:userJoin", data);
    io.sockets. in(data.room).emit("userJoin", {name: data.name});
});
ps.on("userLeave", function(data) {
    clog("PS:userLeave", data);
    io.sockets. in(data.room).emit("userLeave", {name: data.name});
});

//TOOLS
