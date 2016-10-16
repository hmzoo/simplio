var moment = require('moment');
var dbClient  = require('./rc.js').newClient();;


var kttl=60*60*24*365;

var lg={};
lg.setLog = function(room, name,data) {
  var k=moment().format('DD-MM-YY')+":"+room+":"+name+":"+moment().format('HH-mm');
  var d=data

        dbClient.setex('rlog:' + k,kttl, data, function(err, reply) {
            if (err) {
                return false;
            };
            if (reply == "OK") {
                return true;
            }
        });

}

module.exports=lg;
