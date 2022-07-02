const router = require('express').Router();
const {
  celebrate, Joi,
} = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const BadRequestError = require('../errors/badRequest');

const validateURL = (value) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    throw new BadRequestError('Неправильный формат ссылки');
  }
  return value;
};

router.get('/', getMovies);
router.post('/', celebrate({
  body: {
    country: Joi.string().min(1).required(),
    director: Joi.string().min(1).required(),
    duration: Joi.number().integer().required(),
    description: Joi.string().min(1).required(),
    image: Joi.string().custom(validateURL).required(),
    movieId: Joi.string().length(24).hex().required(),
    nameRU: Joi.string().min(1).required(),
    nameEN: Joi.string().min(1).required(),
    owner: Joi.string().length(24).hex().required(),
    thumbnail: Joi.string().custom(validateURL).required(),
    trailerLink: Joi.string().custom(validateURL).required(),
    year: Joi.string().max(4).required(),
  },
}), createMovie);
router.delete('/:movieId', celebrate({
  params: {
    movieId: Joi.string().length(24).hex().required(),
  },
}), deleteMovieById);

module.exports = router;
