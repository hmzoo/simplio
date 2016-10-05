var redis = require('redis');
var Promise = require("bluebird");
//Promise.promisifyAll(redis.RedisClient.prototype);
//Promise.promisifyAll(redis.Multi.prototype);
var dbClient = redis.createClient();
dbClient.on("error", function(err) {
    console.error("Error connecting to redis", err);
});

var getAName = function(cpt) {
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
                resolve({
                    sid: sid,
                    name: name
                })
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

var newUser = function(sid) {
    var pname=getAName();
    var psid=pname.then(function(result){return setSid(sid,result);});
    return psid.then(function(result){return setUser(result.name,{sid:result.sid});});

}

var setUser = function(name, data) {
    return new Promise(function(resolve, reject) {
        dbClient.hmset('user:' + name, data, function(err, reply) {
            if (err) {
                reject("db error");
            };
            if (reply == "OK") {
                resolve({
                    name: name,
                    data: data
                })
            } else {
                reject("user:" + user + " not saved");
            }
        });
    });
}

var getUserBySid = function(sid) {
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
/*
getUserBySid("/#yMBuGx9Oj0BNdsLbAAAB").then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
getUserBySid("/#yMBuGx9Oj0BNdsLbAAABX").then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
getUser('25358').then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e)
});
getUser('25359').then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e)
});
getUserBySid("/#yMBuGx9Oj0BNdsLbAAABX").then(getUser).then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
setSid("oketo", "test").then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
setUser("truc", {
    sid: "test"
}).then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
delSid("/#5sH5J_fAKGzklT0dAAAE").then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
getAName().then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
getAName().then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
getAName().then(function(result) {
    console.log(result)
}).catch(function(e) {
    console.log(e);
});
*/
newUser("/#yMBuGx9Oj0BNdsLbAAABTTX").then(function(result) {
    console.log(result);
}).catch(function(e) {
    console.log(e);
});
