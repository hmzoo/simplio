var socketio = require('socket.io');
var io;


var ps=require('./pubsub.js');
ps.on("roomMessage",function(data){
  console.log("new message from"+data.user+" in "+data.room);
});

var udb=require('./udb.js');
udb.on("newUser",function(data){
  if(data&&data.sid){
    io.sockets.connected[data.sid].emit("userInfos", data);
  }

});



module.exports = function(server) {

    io = socketio.listen(server);


    io.on('connection', function(client) {
        console.log('Client connected ' + client.id);
        udb.registerUser({sid:client.id});


        client.on('disconnect', function() {
            console.log('Client disconnected ' + client.id);
        });

        client.on('test', function(data) {

            ps.pubRoomMessage({room:'ok',user:'test',content:'oketo'});

        });


    });
}
