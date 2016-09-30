var redis = require('redis');

var dbClient = redis.createClient();


var randnum = function(data,cpt) {
        var cpt = (typeof cpt === 'undefined') ? 0 : cpt;
        if (cpt > 50) {
            return;
        }
        data.name = (Math.floor(Math.random() * 90000) + 10000).toString();
        dbClient.hexists('users', data.name, function(err, exists) {
                if (exists) {
                      randnum(data,cpt++);
                }else{
                    udb.registerUser(data);
                }
        });
      }

        var udb = {
            on: function(actionName, action) {
                this[actionName] = action;
            },
            newUser: function(data) {},



            registerUser: function(data) {

                if(!data.name){
                  randnum(data);
                  return;
                }


                dbClient.hset('users', data.name, data.sid)
                dbClient.hmset('user:' + data.sid, {
                    name: data.name
                }, function(err, reply) {
                    dbClient.hgetall('user:' + data.sid, function(err, reply) {
                        console.log(err);
                        console.log(reply);
                    });

                    dbClient.hgetall('users', function(err, reply) {
                        console.log(err);
                        console.log(reply);
                    });
                });

                udb.newUser(data);
            }



        }

        module.exports = udb;
