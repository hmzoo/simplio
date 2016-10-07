var redis = require('redis');
var Promise = require("bluebird");
//Promise.promisifyAll(redis.RedisClient.prototype);
//Promise.promisifyAll(redis.Multi.prototype);
var dbClient = redis.createClient();
dbClient.on("error", function(err) {
    console.error("Error connecting to redis", err);
});

/*DB
sid:ID userName
sid:ID:room roomName
user:ID {createdAt }
user:ID:sids [sid sid sid]
room:ID {createdAt}
room:ID:users [user user user]

newUser(sid)
  get random name
  set sid:sid name
  set user:user {}
  add to user:name:sids sid
  get user:name:sids sids
  notify nameAttribued sids name
newUserSid(sid,name)
  set sid:sid name
  add to user:name:sids sid
  get user:name:sids sids
  notify nameAttribued sids name
removeSid(sid)
  leaveRoom(sid)
  get sid:sid name
  remove form user:name:sids sid
  remove sid:sid

joinRoom(sid,room)
  leaveRoom(sid)
  get sid:sid name
  set sid:sid:room room
  notify userJoin room name
leaveRoom(sid)
  get sid:sid name
  remove sid:sid:room room
  notify userLeave room name

*/

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

var delSid = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.del('sid:' + sid, function(err, reply) {
            if (err) {
                reject("db error");
            };
            if (reply > 0) {
                resolve(sid)
            } else {
                reject("sid:" + sid + " not in db");
            }
        });
    });
}

var setSidRoom = function(sid,room) {
    return new Promise(function(resolve, reject) {
        dbClient.getset('sid:' + sid+":room",room, function(err, reply) {
            if (err) {
                reject("db error");
            }
            if (reply) {
                resolve(reply);
            } else {
                reject("user:" + user + " no room");
            }
        });
    });
}

var delSidRoom = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.del('sid:' + sid+":room", function(err, reply) {
            if (err) {
                reject("db error");
            };
            if (reply > 0) {
                resolve(sid)
            } else {
                reject("sid:" + sid + " not in db");
            }
        });
    });
}

var getSidName = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.get('sid:' + sid, function(err, reply) {
            if (err) {
                reject("db error");
            };
            if (reply) {
                resolve(reply)
            } else {
                reject("sid:" + sid + " no data");
            }
        });
    });
}
var getSidRoom = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.get('sid:' + sid+'room', function(err, reply) {
            if (err) {
                reject("db error");
            };
            if (reply) {
                resolve(reply)
            } else {
                reject("sid:" + sid + " no data");
            }
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

var addUserSid = function(user,sid) {
    return new Promise(function(resolve, reject) {
        dbClient.lpush('user:'+ user+':sids',sid, function(err, reply) {
            if (err) {
                reject("db error");
            }
                resolve(reply);
        });
    });
}

var deleteUserSid = function(user,sid) {
    return new Promise(function(resolve, reject) {
        dbClient.lrem('user:'+ user+':sids',0,sid, function(err, reply) {
            if (err) {
                reject("db error");
            }
                resolve(sid);
        });
    });
}

var getUserSids = function(user){

  return new Promise(function(resolve, reject) {
      dbClient.lrange('user:'+ user+':sids',0,-1, function(err, reply) {
          if (err) {
              reject("db error");
          }
              resolve(reply);
      });
  });

}


var getUserBySid=function(sid){
  return getName(sid).then(getUser);
}

var newUser = function(sid) {
    var prname=getRName();
    var psid=prname.then(function(result){return setSid(sid,result);});
    var pname= psid.then(function(result){return setUser(result,{updatedAt: Date.now()});});
    pname.then(function(result){console.log(sid,result);});
}

var newUserSid=function(sid,user){
  addUserSid(sid,user).then(function(result){console.log(sid,user);});
}

var removeSid=function(sid){
  var name;
  var room;
  var pdelusersid=getSidName(sid).then(function(result){name=result;return deleteUserSid(sid,result)});
  var pdelroomsid=getUserSids(name)pdelusersid.then(function(result){console.log(name,result);return getUserSids(name);});
  pdelusersid.then(delSidRoom).then(function(result){console.log(user,room);});
}
var joinRoom=function(sid,room){}
