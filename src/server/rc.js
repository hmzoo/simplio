var redis = require('redis');
var cfEnv = require("cfenv");
var appEnv = cfEnv.getAppEnv();
var redisCreds = appEnv.getServiceCreds("redis_instance");

module.exports = function() {

    var client;
    if (redisCreds) {
        console.log(redisCreds);
        client = redis.createClient(redisCreds.port, redisCreds.hostname);
        client.auth(redisCreds.password, function(err) {
            if(err){
                throw err;
            }
        });

    } else {
        client = redis.createClient();
    }
    return client;
}
