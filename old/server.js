require('dotenv').config();
var express=require('express');
var redis = require('redis');
var app = express();
var server = require('http').Server(app);
var helmet = require('helmet');
var cookieParser = require('cookie-parser');
var Session = require('express-session')


var RedisStore=require('connect-redis')(Session);
var rclient = redis.createClient();

var session=Session({store:new RedisStore({client:rclient}), key:'jsessionid', secret:'simplioSecret', resave:true,saveUninitialized:true});



var sio= require('./sio.js');

app.use(helmet());
app.set('view engine', 'pug');
//app.use(cookieParser);

app.use(session);




app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  console.log("username :",req.session.id);
    //req.session.user = "Hello";
    res.render('index', { siteTitle: process.env.siteTitle});
});



server.listen(8080);
sio(server,session);

console.log("Server started, listening on 8080 ...");
