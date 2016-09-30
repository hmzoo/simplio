var redis = require('redis');

var sub = redis.createClient();
var pub = redis.createClient();

sub.subscribe('sio');
sub.subscribe('messaging');

sub.on('message', function(channel, message) {
    var data = JSON.parse(message);
    switch (channel) {

        case 'messaging':

            if (data && data.user && data.room && data.content) {

                ps.roomMessage(data);
            }
            break;
        default:
            console.log(channel, JSON.parse(message));

    }
})

var ps = {
    on: function(actionName, action) {
        this[actionName] = action;
    },
    roomMessage: function(data) {},



    pubRoomMessage: function(data) {
        pub.publish('messaging', JSON.stringify(data));
    }



}

module.exports = ps;
