const Movie = require('../models/movie');
const ServerError = require('../errors/server');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch(() => next(new ServerError()));
};

const createMovie = (req, res, next) => {
  const owner = req.user;
  const {
    country, director, duration, description, image,
    movieId, nameRU, nameEN, thumbnail, trailerLink, year,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    description,
    image,
    movieId,
    nameRU,
    nameEN,
    owner,
    thumbnail,
    trailerLink,
    year,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Данные фильма представлены некорректно'));
      } if (err.code === 11000) {
        return next(new ConflictError('Данный фильм уже добавлен'));
      }
      return next(new ServerError());
    });
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId).then((movie) => {
    if (!movie) {
      return next(new NotFoundError('Фильм не найден'));
    }
    return movie;
  })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError());
        return null;
      } if (!movie) {
        return next(new NotFoundError('Фильм не найден'));
      }
      return movie.remove().then(() => res.send({ message: movie }));
    })
    .catch(() => next(new ServerError()));
};

module.exports = {
  getMovies, createMovie, deleteMovieById,
};
