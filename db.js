var redis = require('redis');
var Promise = require("bluebird");
//Promise.promisifyAll(redis.RedisClient.prototype);
//Promise.promisifyAll(redis.Multi.prototype);
var dbClient = redis.createClient();

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

var setSid = function(sid, name) {

    return new Promise(function(resolve, reject) {
        dbClient.set('sid:' + sid, name, function(err, reply) {
            if (err) {
                reject("db error");
            };
            if (reply == "OK") {
                resolve(name);
            } else {
                reject("sid:" + sid + " not saved");
            }
        });
    });
}

var setSidRoom = function(sid, room) {
    return new Promise(function(resolve, reject) {
        dbClient.set('sid:' + sid + ":room", room, function(err, reply) {
            if (err) {
                reject("db error");
            }

            resolve(reply);

        });
    });
}

var deleteSid = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.del('sid:' + sid, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(sid);

        });
    });
}


var deleteSidRoom = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.del('sid:' + sid + ":room", function(err, reply) {
            if (err) {
                reject("db error");
            }

            resolve(sid);

        });
    });
}

var getSidName = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.get('sid:' + sid, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(reply)

        });
    });
}
var getSidRoom = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.get('sid:' + sid + ':room', function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(reply)

        });
    });
}


var setUser = function(name, data) {
    return new Promise(function(resolve, reject) {
        dbClient.hmset('user:' + name, data, function(err, reply) {
            if (err) {
                reject("db error");
            };
            if (reply == "OK") {
                resolve(name);
            } else {
                reject("user:" + user + " not saved");
            }
        });
    });
}



var getUser = function(user) {
    return new Promise(function(resolve, reject) {
        dbClient.hgetall('user:' + user, function(err, reply) {
            if (err) {
                reject("db error");
            }
            if (reply) {
                resolve(reply)
            } else {
                reject("user:" + user + " no data");
            }
        });
    });
}

var addUserSid = function(sid, user) {
    return new Promise(function(resolve, reject) {
        dbClient.lpush('user:' + user + ':sids', sid, function(err, reply) {
            if (err) {
                reject("db error");
            }
            resolve(reply);
        });
    });
}

var removeUserSid = function(sid, user) {
    return new Promise(function(resolve, reject) {
        dbClient.lrem('user:' + user + ':sids', 0, sid, function(err, reply) {
            if (err) {
                reject("db error");
            }
            resolve(sid);
        });
    });
}

var getUserSids = function(user) {

    return new Promise(function(resolve, reject) {
        dbClient.lrange('user:' + user + ':sids', 0, -1, function(err, reply) {
            if (err) {
                reject("db error");
            }
            resolve(reply);
        });
    });

}

var addRoomUser = function(room, user) {
    return new Promise(function(resolve, reject) {
        dbClient.lpush('room:' + room + ':users', user, function(err, reply) {
            if (err) {
                reject("db error");
            }
            resolve(reply);
        });
    });
}

var removeRoomUser = function(room, user) {
    return new Promise(function(resolve, reject) {
        dbClient.lrem('room:' + room + ':users', 0, user, function(err, reply) {
            if (err) {
                reject("db error");
            }
            resolve(sid);
        });
    });
}

var getRoomUsers = function(room) {

    return new Promise(function(resolve, reject) {
        dbClient.lrange('room:' + room + ':users', 0, -1, function(err, reply) {
            if (err) {
                reject("db error");
            }
            resolve(reply);
        });
    });

}

//CallBacks
db.onNameAttribued = function(sids, name) {
    console.log("nameAttribued", sids, name);
}
db.onUserJoin = function(sid,room, name,users) {
    console.log("userJoin", sid,room, name,users);
}
db.onUserLeave = function(sid,room, name) {
    console.log("userLeave", sid,room, name);
}
db.onRoomMessage = function(sid,room, name,message) {
    console.log("roomMessage", sid,room, name,message);
}

//COMBOS

db.join = function(sid) {
    var pgetrname = getRName();
    return pgetrname.then(function(result) {
        return db.joinagain(sid, result);
    });

}

db.joinagain = function(sid, name) {

    var psetsid = setSid(sid, name);
    var psetuser = psetsid.then(function(result) {
        return setUser(result, {
            updatedAt: Date.now()
        });
    });
    var paddusersid = psetuser.then(function(result) {
        return addUserSid(sid, name)
    });
    var pgetusersids = paddusersid.then(function(result) {
        return getUserSids(name)
    });
    return pgetusersids.then(function(result) {
        db.onNameAttribued(result, name);
        return Promise.resolve({
            name: name,
            sids: result
        })
    });
}

db.leave = function(sid) {

    var pleaveroom = db.leaveRoom(sid);
    var premoveusersid = pleaveroom.then(function(result) {
        return removeUserSid(sid, result.name);
    });
    var pdelsid = premoveusersid.then(function(result) {
        return deleteSid(sid)
    });
    return pdelsid.then(function(result) {
        return new Promise.resolve({});
    });
}

db.joinRoom = function(sid, room) {
    var name;
    var pleaveroom = db.leaveRoom(sid);
    var psetsidroom = pleaveroom.then(function(result) {
        name = result.name;
        return setSidRoom(sid, room);
    });
    var addroomuser=psetsidroom.then(function(result){return addRoomUser(room,name);});
    var getroomusers=addroomuser.then(function(result){return getRoomUsers(room);})
    return getroomusers.then(function(result) {
        db.onUserJoin(sid,room, name,result);
        return Promise.resolve({
            name: name,
            room: room,
            users:result
        })
    });
}

db.leaveRoom = function(sid) {
    var name;
    var room;
    var pgetsidname = getSidName(sid);
    var pgetsidroom = pgetsidname.then(function(result) {
        name = result;
        return getSidRoom(sid);
    });
    var pdeletesidroom = pgetsidroom.then(function(result) {
      console.log("R",result);
        room = result;
        return deleteSidRoom(sid);
    });
    var removeroomuser=pdeletesidroom.then(function(result){return removeRoomUser(room,name);});
    return removeroomuser.then(function(result) {
        db.onUserLeave(sid,room, name);
        return Promise.resolve({
            name: name,
            room: room
        })
    });

}
db.roomMessage=function(sid,message){
  var name;
  var room;
  var pgetsidname = getSidName(sid);
  var pgetsidroom = pgetsidname.then(function(result) {
      name = result;
      return getSidRoom(sid);
  });
  return pgetsidroom.then(function(result){
    room=result;
    db.onRoomMessage(room,name,message)
    return Promise.resolve({
        name: name,
        room: room,
        message: message
    })

  });

}

module.exports = db;
//db.join("YYEESS");
//db.joinRoom("YYEESS", "OK");
//db.leaveRoom("YYEESS");
