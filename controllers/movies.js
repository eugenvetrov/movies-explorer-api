const Movie = require('../models/movie');
const ServerError = require('../errors/server');
const BadRequestError = require('../errors/badRequest');
const ConflictError = require('../errors/conflict');
const NotFoundError = require('../errors/notFound');
const ForbiddenError = require('../errors/forbidden');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => {
      next(new ServerError());
    });
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
        next(new BadRequestError('Данные фильма представлены некорректно'));
      } else if (err.code === 11000) {
        next(new ConflictError('Данный фильм уже добавлен'));
      } else {
        next(new ServerError());
      }
    });
};

const deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId).then((movie) => {
    if (!movie) {
      next(new NotFoundError('Карточка не найдена'));
    }
    return movie;
  })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError());
        return null;
      }
      return Movie.findByIdAndRemove(req.params.movieId);
    })
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм не найден'));
      } else {
        res.send({ message: 'Фильм удален' });
      }
    })
    .catch(() => {
      next(new ServerError());
    });
};

module.exports = {
  getMovies, createMovie, deleteMovieById,
};
