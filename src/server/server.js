var express = require('express');
var helmet = require('helmet');
var app = express();
var server = require('http').Server(app);

app.use(helmet());
app.use(express.static(__dirname + '/dist'));

server.listen(8080);
console.log("Server started, listening on 8080 ...");

var socketio = require('socket.io');
var io = socketio.listen(server);

io.on('connection', function(client) {
    console.log('Client connected ' + client.id);

    client.on('disconnect', function() {
        console.log('Client disconnected ' + client.id);
    });

    client.on('nameRequest', function() {
        console.log('Name request from' + client.id );
        newClient(client.id);
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

var redis = require('redis');
var dbClient = redis.createClient();

var newClient = function(sid, cpt) {
    if (typeof cpt === 'undefined') {
        cpt = 0;
    }
    if (cpt > 50) {
        return;
    }
    console.log(cpt);
    var rname = (Math.floor(Math.random() * 90000) + 10000).toString();
    dbClient.hexists('user:' + rname, function(err, exists) {
        if (exists) {
            newClient(sid, cpt++);
        } else {
            dbClient.set('sid:' + sid, rname);
            dbClient.hmset('user:' + rname, {
                sid: sid,
                room: ""
            }, function(err, reply) {
              console.log(err,reply);
                if(!err){
                  var s = io.sockets.connected[sid];
                  s.emit("nameAttribued", {name:rname});
                }
            });
        }
    });

}
