const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Unauthorized = require('../errors/unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [{
      validator: (email) => validator.isEmail(email),
      message: 'Пожалуйста, введите корректный email',
    },
    ],
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: [{
      validator: (password) => (!!password),
      message: 'Пожалуйста, введите корректный пароль',
    },
    ],
  },
  name: {
    type: String,
    required: false,
    minlength: 1,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Unauthorized());
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Unauthorized());
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
