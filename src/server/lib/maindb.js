var Promise = require("bluebird");
var dbClient = require("./rc.js").newClient();
var userdb = require("./userdb.js");
var siddb = require("./siddb.js");

var maindb = {
  hbsid:siddb.hbsid
};

maindb.join = function(sid) {
    var user = '';
    var pnewuser = userdb.newUser();
    var pnewsid = pnewuser.then(function(result) {
        user = result;
        return siddb.newSid(sid, user)
    });
    return pnewsid.then(function(result) {
        return Promise.resolve(user);
    });

}

maindb.rejoin = function(sid, user) {
    var pgetuser = userdb.getUser(user);
    return pgetuser.then(function(result) {
        if (result) {
            return siddb.newSid(sid, user);
        } else {
            return maindb.join(sid);
        }
    });
}



maindb.leave = function(sid) {
    var data = {};
    var paboutsid = siddb.aboutSid(sid);
    var forgetsid = paboutsid.then(function(result) {
        data = result;
        return siddb.forgetSid(sid);
    });

    return forgetsid.then(function(result) {
        return Promise.resolve(data);
    });
}

maindb.joinRoom=function(sid, room) {
    var data = {
        user: '',
        room: room,
        oldroom: ''
    };
    var paboutsid = siddb.aboutSid(sid);
    var psetsidroom = paboutsid.then(function(result) {
        data.user = result.user;
        data.oldroom = result.room;
        return siddb.setSidRoom(sid, room);
    });
    return psetsidroom.then(function(result) {
        return Promise.resolve(data);
    });
}



module.exports = maindb;
