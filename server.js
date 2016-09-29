require('dotenv').config();
var express=require('express');
var app = express();
var server = require('http').Server(app);
var helmet = require('helmet');
var sio= require('./sio.js');

app.use(helmet());
app.set('view engine', 'pug');




app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index', { siteTitle: process.env.siteTitle});
});



server.listen(8080);
sio(server);

console.log("Server started, listening on 8080 ...");
