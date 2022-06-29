const router = require('express').Router();
const {
  celebrate, Joi,
} = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', createMovie);
router.delete('/:movieId', celebrate({
  params: {
    cardId: Joi.string().length(24).hex().required(),
  },
}), deleteMovieById);

module.exports = router;
