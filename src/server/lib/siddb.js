var Promise = require("bluebird");
var dbClient = require("./rc.js").getClient();

var kttl = 60 * 60 * 48;

var db = {};

var setSid = function(sid) {
    var now = Date.now();
    return new Promise(function(resolve, reject) {
        dbClient.setex('sid:' + sid, kttl, now, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(sid);

        });
    });
}

var setSidUser = function(sid, name) {

    return new Promise(function(resolve, reject) {
        dbClient.setex('sid:' + sid + ":user", kttl, name, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(sid);

        });
    });
}
var getsetSidRoom = function(sid, room) {
    return new Promise(function(resolve, reject) {
        dbClient.getset('sid:' + sid + ":room", room, function(err, reply) {
            if (err) {
                reject("db error");
            }

            resolve(reply);

        });
    });
}
var setSidRoom = function(sid, room) {
    return new Promise(function(resolve, reject) {
        dbClient.setex('sid:' + sid + ":room", kttl, room, function(err, reply) {
            if (err) {
                reject("db error");
            }

            resolve(sid);

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
var deleteSidUser = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.del('sid:' + sid + ':user', function(err, reply) {
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
var getSetSid = function(sid) {
    var now = Date.now();
    return new Promise(function(resolve, reject) {
        dbClient.getset('sid:' + sid, now, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(reply)

        });
    });
}
var getSid = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.get('sid:' + sid, function(err, reply) {
            if (err) {
                reject("db error");
            };

            resolve(reply)

        });
    });
}
var getSidUser = function(sid) {
    return new Promise(function(resolve, reject) {
        dbClient.get('sid:' + sid + ':user', function(err, reply) {
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

var siddb = {
    setSid: setSid,
    setSidUser: setSidUser,
    setSidRoom: setSidRoom
};

//COMBOS
siddb.newSid = function(sid, user) {
    psetsid = setSid(sid);
    psetsiduser = psetsid.then(function(result) {
        return setSidUser(sid, user);
    });
    psetsidroom = psetsiduser.then(function(result) {
        return setSidRoom(sid, '');
    });
    return psetsidroom.then(function(result) {
        return Promise.resolve(user);
    });
}

siddb.forgetSid = function(sid) {
    return deleteSid(sid).then(deleteSidRoom).then(deleteSidUser);
}

siddb.aboutSid = function(sid) {
    var data = {
        user: '',
        hb: '',
        room: ''
    };
    var pgetsid = getSid(sid)
    var pgetsiduser = pgetsid.then(function(result) {
        if (result) {
            data.hb = result;
        }
        return getSidUser(sid);
    });
    var pgetsidroom = pgetsiduser.then(function(result) {
        if (result) {
            data.user = result;
        }
        return getSidRoom(sid);
    });
    return pgetsidroom.then(function(result) {
        if (result) {
            data.room = result;
        }
        return Promise.resolve(data);
    });

}

siddb.hbsid=function(sid){
  var data = {
      user: '',
      hb: '',
      room: ''
  };
  var pgetsid = getSetSid(sid)
  var pgetsiduser = pgetsid.then(function(result) {
      if (result) {
          data.hb = result;
      }
      return getSidUser(sid);
  });
  var pgetsidroom = pgetsiduser.then(function(result) {
      if (result) {
          data.user = result;
      }
      return getSidRoom(sid);
  });
  return pgetsidroom.then(function(result) {
      if (result) {
          data.room = result;
      }
      return Promise.resolve(data);
  });

}

module.exports = siddb;
