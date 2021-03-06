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
var dbClient = require("./lib/rc.js").newClient();
var RedisStore = require('connect-redis')(Session);
var sessionStore = new RedisStore({client: dbClient});
var session = Session({store: sessionStore, key: 'JSESSIONID', secret: 'simplioSecret', resave: true, saveUninitialized: true});

app.use(helmet());
app.use(session);
app.use(express.static(__dirname + '/dist'));

server.listen(appEnv.port);
clog("Server started", "listening on " + appEnv.bind + " port: " + appEnv.port + " ...");

var lg = require("./lib/lg.js");
var db = require("./lib/db.js");
var maindb = require("./lib/maindb.js");
var ps = require("./lib/ps.js");

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
        maindb.leave(client.id).then(function(result) {
            ps.pub("userLeave", {
                user: result.user,
                room: result.room
            });

        });
    });

    client.on('join', function() {
        var s = io.sockets.connected[client.id];
        if (!client.handshake.session.user) {
            maindb.join(client.id).then(function(result) {
              if(!result){
                s.emit('serverError', "Can't attribute a name");
              }
                s.handshake.session.user = result;
                s.handshake.session.save();
                s.emit('joined', result);
            });

        } else {
            maindb.rejoin(client.id, client.handshake.session.user).then(function(result) {
                s.handshake.session.user = result;
                s.handshake.session.save();
                s.emit('joined', result);
            });
        }

    });

    client.on('joinRoom', function(room) {
      clog("CLT","joinroom "+room);
        var s = io.sockets.connected[client.id];
        maindb.joinRoom(client.id, room).then(function(result) {
            if (result.oldroom) {
                s.leave(result.oldroom);
                ps.pub("userLeave", {
                    user: result.user,
                    room: result.oldroom
                });
            }
            s.join(result.room);
            s.emit('roomJoined', result.room);
            ps.pub("userJoin", {
                user: result.user,
                room: result.room
            });
        });

    });

    client.on('roomMessage', function(message) {
        maindb.hbsid(client.id).then(function(result) {
            ps.pub("roomMessage", {
                user: result.user,
                room: result.room,
                message: message
            });

        });

    });

});
//TIMER
var checksids = function() {
    //  console.log(io.sockets.connected);
    if (io.sockets.connected === undefined) {
        return;
    }
    for (s in io.sockets.connected) {
        clog("socket", s, io.sockets.connected[s].connected);
    }

}



//PUBSUB

ps.on("roomMessage", function(data) {
    if (!data || !data.user || !data.room || !data.message) {
        return
    }
    io.sockets. in(data.room).emit("roomMessage", {
        user: data.user,
        message: data.message
    });
});
ps.on("userJoin", function(data) {
    if (!data || !data.user || !data.room) {
        return
    }
    io.sockets. in(data.room).emit("userJoin", data.user);
});
ps.on("userLeave", function(data) {
    if (!data || !data.user || !data.room) {
        return
    }
    io.sockets. in(data.room).emit("userLeave", data.user);
});

//TOOLS
