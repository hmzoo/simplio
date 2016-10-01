var redis = require('redis');

var dbClient = redis.createClient();

var randnum = function(data, cpt) {
    var cpt = (typeof cpt === 'undefined')
        ? 0
        : cpt;
    if (cpt > 50) {
        return;
    }
    data.user = (Math.floor(Math.random() * 90000) + 10000).toString();
    dbClient.hexists('user:' + data.user, function(err, exists) {
        if (exists) {
            randnum(data, cpt++);
        } else {
            udb.registerUser(data);
        }
    });
}

var udb = {
    on: function(actionName, action) {
        this[actionName] = action;
    },
    newUser: function(data) {},
    userJoinRoom: function(data) {},
    userLeaveRoom: function(data) {},

    registerUser: function(data) {

        if (!data.user) {
            randnum(data);
            return;
        }

        dbClient.set('sid:' + data.sid, data.user);
        dbClient.hmset('user:' + data.user, {
            sid: data.sid,
            room:""
        }, function(err, reply) {
          console.log(err);
        });

        udb.newUser(data);
    },
    unRegisterUser: function(data) {
        
        dbClient.get("sid:" + data.sid, function(err, reply) {
            if (reply) {
                dbClient.del('sid:' + data.sid);
                data.user=reply;
                console.log(reply);
                dbClient.hmget('user:' + reply,'room',function(err,reply) {
                  if(reply&&reply[0]){
                    data.room=reply[0];
                    udb.userLeaveRoom(data);
                  }
                });
            }
        });
    },
    userJoiningRoom: function(data) {
        dbClient.get("sid:" + data.sid, function(err, reply) {
            if (reply) {
                data.user=reply;
                dbClient.hmset('user:' + reply, {
                    room: data.room
                }, function(err, reply) {
                    udb.userJoinRoom(data);
                });
            }
        });
    }

}

module.exports = udb;
