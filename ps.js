var cfEnv = require("cfenv");
var appEnv = cfEnv.getAppEnv();
var redisCredentials = appEnv.getServiceCreds("redis_instance");
var redis = require('redis');

var sub = redis.createClient(redisCredentials);
var pub = redis.createClient(redisCredentials);

sub.subscribe('iops');

sub.on('message', function(channel, message) {
    var data = JSON.parse(message);
    var action = data.psaction;
    delete data.psaction;
    switch (action) {

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

    pub: function(action, data) {
        if (!data || !action) {
            return;
        }
        data.psaction = action;
        pub.publish('iops', JSON.stringify(data));
    }

}

module.exports = ps;
