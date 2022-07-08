const {
  celebrate, Joi,
} = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/badRequest');

const validateEmail = (value) => {
  if (!validator.isEmail(value, { require_protocol: true })) {
    throw new BadRequestError('Неправильный формат email');
  }
  return value;
};

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new BadRequestError('Неправильный формат ссылки');
  }
  return value;
};

const validateCreateUser = celebrate({
  body: {
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
});

const validateLogin = celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
});

const validateUpdateUser = celebrate({
  body: {
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().custom(validateEmail).required(),
  },
});

const validateCreateMovie = celebrate({
  body: {
    country: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    duration: Joi.number().integer().required(),
    description: Joi.string().min(1).required(),
    image: Joi.string().custom(validateURL).required(),
    movieId: Joi.number().integer().required(),
    nameRU: Joi.string().min(1).required(),
    nameEN: Joi.string().min(1).required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    trailerLink: Joi.string().custom(validateURL).required(),
    year: Joi.string().max(4).required(),
  },
});

const validateDeleteMovieById = celebrate({
  params: {
    movieId: Joi.string().length(24).hex().required(),
  },
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUpdateUser,
  validateCreateMovie,
  validateDeleteMovieById,

};
