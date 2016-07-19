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
var allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' == req.method) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(200);
    }
    else {
      next();
    }
};
require('./config/passport.js')(passport);
require('./routes.js')(app, passport);

mongoose.connect(config.database);
app.use(allowCrossDomain); 
 
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    res.redirect('https://www.redrive.co'+req.url)
  else
    next() /* Continue to other routes if we're not redirecting */
})
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
 // load our routes and pass in our app and fully configured passport
// launch ======================================================================
server = app.listen(process.env.PORT || 1738, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
