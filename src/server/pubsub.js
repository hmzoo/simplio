var redis = require('redis');

var sub = redis.createClient();
var pub = redis.createClient();

sub.subscribe('iops');

sub.on('message', function(channel, message) {
    var data = JSON.parse(message);

    switch (data.action) {

        case 'roomMessage':
            ps.roomMessage(data);
            break;
        case 'userJoin':
            ps.userJoin(data);
            break;
        case 'userLeave':
            ps.userLeave(data);
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
    userJoin: function(data) {},
    userLive: function(data) {},

    pub: function(data) {
        pub.publish('iops', JSON.stringify(data));
    }

}

module.exports = ps;
