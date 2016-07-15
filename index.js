var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require("path");
var LocalStrategy = require('passport-local').Strategy;

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var config = require('./config/main');
var fs = require('fs');

mongoose.connect(config.database);
// app.get('*',function(req,res,next){
//   if(req.headers['x-forwarded-proto']!='https')
//     res.redirect('https://www.drivecarista.com'+req.url)
//   else
//     next() /* Continue to other routes if we're not redirecting */
// })
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
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'www.drivecarista.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, Content-Type, Content-Range, Content-Disposition, Content-Description');
    next();
});

require('./config/passport.js')(passport);
require('./routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// launch ======================================================================
server = app.listen(process.env.PORT || 1738, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
