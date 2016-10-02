var socketio = require('socket.io');
var ios = require('socket.io-express-session');
var io;

var isHere = function(sid) {
    if (io.sockets.connected[sid]) {
        return true;
    }
    return false;
}

var ps = require('./pubsub.js');
ps.on("roomMessage", function(data) {
  console.log("roomMessage",data);
    io. in(data.room).emit("roomMessage", data);
});
ps.on("userJoin", function(data) {
  console.log("userJoin",data);
    io. in(data.room).emit("userJoin", data.user);
});
ps.on("userLeave", function(data) {
  console.log("userLeave",data);
    io. in(data.room).emit("userLeave", data.user);
});

var udb = require('./udb.js');
udb.on("newUser", function(data) {
    if (data && data.sid && isHere(data.sid)) {
        var s = io.sockets.connected[data.sid];
        s.handshake.session.user = data.user;
        s.handshake.session.save();
        s.emit("userInfos", data);
    }

});
udb.on("userJoinRoom", function(data) {
    if (data && data.sid && data.user && data.room) {
        if (isHere(data.sid)) {
            var s = io.sockets.connected[data.sid];
            var oldRoom = s.handshake.session.room;
            if (oldRoom) {
              ps.pub({action:'userLeave',user:data.user,room:oldRoom});
              s.leave(oldRoom);
            }
            s.handshake.session.room = data.room;
            s.handshake.session.save();
            s.join(data.room);
            s.emit("roomJoined", data.room);
        }
        ps.pub({action:'userJoin',user:data.user,room:data.room});
    }

});

udb.on("userLeaveRoom", function(data) {
        ps.pub({action:'userLeave',user:data.user,room:data.room});
});

module.exports = function(server, session) {

    io = socketio.listen(server);
    io.use(ios(session, {autoSave: true}));

    io.on('connection', function(client) {
        console.log('Client connected ' + client.id);
        var data = {
            sid: client.id
        }
        if (client.handshake.session.user) {
            data.user = client.handshake.session.user;
        }
        udb.registerUser(data);

        client.on('disconnect', function() {
            console.log('Client disconnected ' + client.id);
            udb.unRegisterUser({sid:client.id});
        });

        client.on('roomMessage', function(data) {
            data.action = 'roomMessage'
            ps.pub(data);

        });

        client.on('joinRoom', function(data) {
            data.sid = client.id;
            udb.userJoiningRoom(data);
            console.log(client.id, "joinRoom ", data)
        });

    });
}
