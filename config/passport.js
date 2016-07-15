var JwtStrategy = require('passport-jwt').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// load up the user model
var User = require('../models/buyer');
 var fbConfig = require('./facebook'); // get db config file
  var googleConfig = require('./google');
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
   passport.use(new GoogleStrategy({
           clientID        : googleConfig.clientID,
           clientSecret    : googleConfig.clientSecret,
           callbackURL     : googleConfig.callbackURL,

       },
       function(token, refreshToken, profile, done) {
           // make the code asynchronous
           // User.findOne won't fire until we have all our data back from Google
           process.nextTick(function() {

               // try to find the user based on their google id
               console.log(profile.id);
               User.findOne({ '_id' : profile.id }, function(err, user) {
                   if (err)
                        done(err);

                   if (user) {
                     console.log('yes a user')
                       // if a user is found, log them in
                        done(null, user);
                   } else {
                     console.log(user);
                       // if the user isnt in our database, create a new user
                       var newUser          = new User();

                       // set all of the relevant information
                       newUser._id    = profile._json.id; // set the users facebook id
                       newUser.access_token = token; // we will save the token that facebook provides to the user
                       newUser.nameFirst  = profile._json.name.givenName;
                       newUser.nameLast = profile._json.name.familyName; // look at the passport user profile to see how names are returned
                       newUser.email = profile._json.emails[0].value; // pull the first email

                       // save the user
                       newUser.save(function(err) {
                           if (err)
                               throw err;
                            done(null, newUser);
                       });
                   }
               });
           });

       }));

  passport.use('facebook', new FacebookStrategy({
  clientID        : fbConfig.appID,
  clientSecret    : fbConfig.appSecret,
  callbackURL     : fbConfig.callbackUrl,
  profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'photos'],

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
             done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();

            // set all of the facebook information in our user model
            newUser._id    = profile._json.id; // set the users facebook id
            newUser.access_token = access_token; // we will save the token that facebook provides to the user
            newUser.nameFirst  = profile._json.first_name;
            newUser.username = profile.displayName;
            newUser.nameLast = profile._json.last_name; // look at the passport user profile to see how names are returned
            newUser.email = profile._json.email; // facebook can return multiple emails so we'll take the first
            newUser.photos = "https://graph.facebook.com/" + profile.displayName + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken;

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
