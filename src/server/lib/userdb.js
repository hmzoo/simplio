var Promise = require("bluebird");
var dbClient = require("./rc.js").getClient();;

var kttl = 60 * 60 * 48;

var db = {};

var getRName = function(cpt) {
    var cpt = cpt || 0;
    if (cpt > 30) {
        throw new Error("No more place free !!");
    }
    var rname = (Math.floor(Math.random() * 90000) + 10000).toString();

    return new Promise(function(resolve, reject) {
        dbClient.exists('user:' + rname, function(err, exists) {
            if (err) {
                reject("db error");
            };
            if (exists) {
                console.log(rname, "exists!");
                resolve("");
            } else {
                resolve(rname);
            }

        });

    }).then(function(result) {
        if (result == "") {
            return getAName(cpt + 1);
        } else {
            return Promise.resolve(result);
        }
    });

}

var setUser = function(user, data) {
    var data = data || {
        createdAt: Date.now()
    };
    return new Promise(function(resolve, reject) {
        dbClient.hmset('user:' + user, data, function(err, reply) {
            if (err) {
                reject("db error");
            };

            dbClient.expire('user:' + user, kttl, function(err, reply) {
                resolve(user);
            });

        });
    });
}

var getUser = function(user) {
    return new Promise(function(resolve, reject) {
        dbClient.hgetall('user:' + user, function(err, reply) {
            if (err) {
                reject("db error");
            }
            resolve(reply)
        });
    });
}

var userdb = {
    getUser: getUser,
    setUser,
    setUser
}

//COMBOS

userdb.newUser = function() {
    var pgetrname = getRName();
    return pgetrname.then(setUser);
}

module.exports = userdb;
