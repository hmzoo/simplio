var redis = require('redis');
var dbClient = redis.createClient();

module.exports=function(sender){

var self={};
var sender=sender;


self.newClient = function(sid, cpt) {
    if (typeof cpt === 'undefined') {
        cpt = 0;
    }
    if (cpt > 50) {
        return;
    }

    var rname = (Math.floor(Math.random() * 90000) + 10000).toString();
    dbClient.exists('user:' + rname, function(err, exists) {

        if (exists) {
            self.newClient(sid, cpt++);
        } else {
            dbClient.set('sid:' + sid, rname);
            dbClient.hmset('user:' + rname, {
                sid: sid,
                room: ""
            }, function(err, reply) {

                if(!err){
                  console.log("new User "+rname+" cpt:"+cpt);
                  sender.sendNameAtribued(sid, rname)
                }
            });
        }
    });


}
self.updateClient = function(sid, name) {

    dbClient.exists('user:' + name, function(err, exists) {
        if (!exists) {
            self.newClient(sid);
        } else {
            dbClient.set('sid:' + sid, name);
            dbClient.hmset('user:' + name, {
                sid: sid
            }, function(err, reply) {
              console.log(err,reply);
                if(!err){
                  sender.sendNameAtribued(sid, name)
                }
            });
        }
    });
}




return self;
};