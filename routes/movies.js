const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovieById } = require('../middlewares/validationByCelebrate');

router.get('/', getMovies);
router.post('/', validateCreateMovie, createMovie);
router.delete('/:movieId', validateDeleteMovieById, deleteMovieById);

module.exports = router;
