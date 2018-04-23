const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    unique: true,
    validate: {
      validator: validator.isEmail,
      massage: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    }
  }],
});

// methods are added to the instance
UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens = user.tokens.concat([{ access, token }]);
  return user.save()
    .then(() => token);
};

// statics are added to the schema 
UserSchema.statics.findByToken = function(token) {
  const User = this;
  let decoded;
  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    return Promise.reject('Not authenticated');
  }
  return User.findOne(
    { 
      '_id': decoded._id,
      'tokens.token': token,
      'tokens.access': 'auth'
    });

};

const User = mongoose.model('User', UserSchema);

module.exports = { User };