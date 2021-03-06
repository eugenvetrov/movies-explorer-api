const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ServerError = require('../errors/server');
const ConflictError = require('../errors/conflict');
const BadRequestError = require('../errors/badRequest');

const { NODE_ENV, JWT_SECRET } = process.env ? process.env : { NODE_ENV: '', JWT_SECRET: 'our_little_secret' };

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.validate({
        name, email, password,
      });
      return hash;
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.send({
        data: {
          name: user.name, email: user.email,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return next(new BadRequestError(`Поле ${fields} заполнено некорректно. ${err.errors.email ? err.errors.email : ''}${err.errors.password ? err.errors.password : ''}`));
      } if (err.code === 11000) {
        return next(
          new ConflictError('Данный пользователь уже существует в базе данных'),
        );
      }
      return next(new ServerError(err.message));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'our_little_secret', { expiresIn: '7d' });
      res.status(200).cookie('jwt', token, { httpOnly: true }).send({ token });
    })
    .catch((err) => next(err));
};

const clearCookie = (req, res, next) => {
  try {
    return res.status(200).clearCookie('jwt').send({ message: 'Выход' });
  } catch (err) {
    return next(new ServerError());
  }
};

module.exports = {
  createUser,
  login,
  clearCookie,
};
