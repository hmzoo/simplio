var socketio = require('socket.io');
var io;




module.exports = function(server) {

    io = socketio.listen(server);

    io.on('connection', function(client) {
        console.log('Client connected ' + client.id);


        client.on('disconnect', function() {
            console.log('Client disconnected ' + client.id);
        });

        client.on('test', function(data) {

            console.log('test', data);
        });


    });
}
