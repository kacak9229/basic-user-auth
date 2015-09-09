var mongoose   = require('mongoose');
var bcrypt	   = require('bcrypt-nodejs');
var Schema     = mongoose.Schema;

var UserSchema = Schema({
  
  // Basic information for a user, feel free to add as many properties as you like
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  username: { type: String, required: true, unique: true, lowercase: true},
  password: { type: String, required: true},
  
});

// UserSchema method - For hashing a string password to hash type
UserSchema.methods.hashPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync());
};

// UserSchema method - For comparing a user password with the mongodb password
UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema);
