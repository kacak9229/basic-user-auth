// Libraries for routing, jsonwebtoken a user configuration and user models
var router    = require('express').Router();
var jwt       = require('jsonwebtoken');
var User      = require('../models/user');
var config    = require('../../config');

var secretKey = config.secretKey;

// Creating a token function
function createToken(user) {

  var token = jwt.sign({
    id: user._id,
    email: user.email,
    username: user.username
  }, secretKey , {
    expiresInMinute: 1440
  });

  return token;

}

/* For checking whether the user does exist and has the token or not
    Could be use for routes that need authentication
*/
function ensureAuthenticated(req, res, next) {

  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // check if token does exist
  if (token) {
    jwt.verify(token, secretKey, function(err, user) {

      if (err) {
        return res.status(403).send({ success: false, message: 'Failed to authenticate user' });
      } else {
        req.user = user;
        return next();
      }
    });
  } else {
    return res.status(403).send({ success: false, message: 'No Token Provided'});
  }
}

// Signup route
router.post('/signup', function(req, res) {

  var user = new User();
  user.email = req.body.email;
  user.username = req.body.username;
  user.password = user.hashPassword(req.body.password);

  var token = createToken(user);
  user.save(function(err) {
    if (err) {
      res.send(err);
      return;
    }

    res.json({
      success: true,
      message: 'User has been created!',
      token: token
    });

  });

});



// Login route
router.post('/login', function(req, res) {
  User.findOne({
    username: req.body.username
  }).select('name username password').exec(function(err, user) {

    if (err) throw err;

    if (!user) {
      res.send({ message: "User doesn't exist" });

    } else if (user) {

      var validPassword = user.comparePassword(req.body.password);

      if (!validPassword) {
        res.send({ message: 'Invalid Password'});
      } else {

        var token = createToken(user);

        res.json({
          success: true,
          message: "Successfully login",
          token: token
        });
      }
    }
  });
});

// If user does authenticated then go to this route.
router.get('/', ensureAuthenticated, function(req, res) {

  res.json({ message: "Testing 123" });

});


module.exports = router;
