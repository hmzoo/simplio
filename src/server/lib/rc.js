var redis = require('redis');
var cfEnv = require("cfenv");
var appEnv = cfEnv.getAppEnv();
var redisCreds = appEnv.getServiceCreds("redis_instance");

var rc={};

rc.newClient = function() {
    var client;
    if (redisCreds) {
        client = redis.createClient(redisCreds.port, redisCreds.hostname);
        client.auth(redisCreds.password, function(err) {
            if (err) {
                throw err;
            }
        });

    } else {
        client = redis.createClient();
    }
    return client;
}
var mainClient=rc.newClient();
rc.getClient=function(){
  return mainClient;
}

module.exports = rc;
