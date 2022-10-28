require('dotenv').config()
var express = require('express');
var app = express();
var session = require('express-session');
var passport = require('passport');
var path = require('path')
var port = process.env.PORT || 8080

var server = require('http').createServer(app);

var io = require('socket.io')(server);
require('./auth');
//Public
app.use(express.static('public'));
//View engine
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'))

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/logout', (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect("/");
      })
    req.session.destroy();
    res.send('Goodbye!');
  });
  
  app.get('/auth/google/failure', (req, res) => {
    res.send('Failed to authenticate..');
  });
  
function isLoggedIn(req, res, next) {
    req.user ? next() : res.render('login')
  }

app.get('/',isLoggedIn ,function (req, res) {
    
    res.render('index',{user : req.user});
});

io.of('/').on('connection', function (client) {
        console.log('Client connected...');
        client.on('join', function (data) {
            console.log(data + ' Join');
        });
        client.on('messages',function(data){
            client.emit('thread',data);
            client.broadcast.emit('thread',data);
        });
    });


server.listen(port)