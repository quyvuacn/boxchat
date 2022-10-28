require('dotenv').config()
var express = require('express');
var app = express();
var session = require('express-session');
var passport = require('passport');
var port = process.env.PORT || 8000

var server = require('http').createServer(app);

var io = require('socket.io')(server);
require('./auth');

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('Goodbye!');
  });
  
  app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });
  
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
  }

app.get('/', function (req, res) {
    res.sendfile(__dirname + "/public/index.html");
});

app.use(express.static('public'));

io.on('connection', function (client) {
    console.log('Client connected...');
    client.on('join', function (data) {
        console.log(data);
    });
    client.on('messages',function(data){
        client.emit('thread',data);
        client.broadcast.emit('thread',data);
    });
});
server.listen(port)