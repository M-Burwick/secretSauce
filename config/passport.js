var JwtStrategy = require('passport-jwt').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
var User = require('../models/buyer');
 var fbConfig = require('./facebook'); // get db config file
module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
       done(null, user.id);
   });

   // used to deserialize the user
   passport.deserializeUser(function(id, done) {
       User.findById(id, function(err, user) {
           done(err, user);
       });
   });

  passport.use('facebook', new FacebookStrategy({
  clientID        : fbConfig.appID,
  clientSecret    : fbConfig.appSecret,
  callbackURL     : fbConfig.callbackUrl,
  profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],

},

  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {
    // asynchronous
    process.nextTick(function() {

      // find the user in the database based on their facebook id
      User.findOne({ '_id' : profile.id }, function(err, user) {

        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
           done(err);

          // if the user is found, then log them in
          if (user) {
            console.log('logged in!');
             done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser._id    = profile._json.id; // set the users facebook id
            newUser.access_token = access_token; // we will save the token that facebook provides to the user
            newUser.nameFirst  = profile._json.first_name;
            newUser.nameLast = profile._json.last_name; // look at the passport user profile to see how names are returned
            newUser.email = profile._json.email; // facebook can return multiple emails so we'll take the first

            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;

              // if successful, return the new user
               done(null, newUser);
            });
         }
      });
    });
}));
};
