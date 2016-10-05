var redis = require('redis');
var Promise = require("bluebird");
//Promise.promisifyAll(redis.RedisClient.prototype);
//Promise.promisifyAll(redis.Multi.prototype);
var dbClient = redis.createClient();

var pn = [];

var isPrime = function(n, p) {
    return new Promise(function(resolve, reject) {
        for (i = 0; i < p.length; i++) {
            console.log("check", p[i]);
            if (n % p[i] == 0) {
                reject(n);
                return;
            }
        }
        resolve(n);
    });
}

findprim = function(n, p) {

    isPrime(n, p).then(function(result) {
        console.log("prim", result);
        p.push(n);
        return findprim(n + 1, p);
    }).catch(function(err) {
        console.log("not prim", err);
        return findprim(n + 1, p);
    });
}

prim = function(n, p) {

    for (i = 0; i < p.length; i++) {
        if (n % p[i] == 0) {
            return false;
        }
    }
    return true;
}
var pn = [];
var n = 2;
while (true) {
    if (prim(n, pn)) {
        pn.push(n);
        console.log(n);
    }
    n = n + 1;

}
