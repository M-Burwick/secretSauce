var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require("path");
var LocalStrategy = require('passport-local').Strategy
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config/main');

mongoose.connect(config.database);
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
// required for passport
app.use(session({
    secret: 'pandaisdamaninjapans'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(morgan('dev'));
app.use(passport.initialize());

app.use(passport.session());

require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================

server = app.listen(process.env.PORT || 1738, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
