const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: [{
      validator: (link) => validator.isURL(link),
      message: 'Пожалуйста, введите корректную ссылку на изображение',
    },
    ],
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: [{
      validator: (link) => validator.isURL(link),
      message: 'Пожалуйста, введите корректную ссылку на изображение',
    },
    ],
  },
  trailerLink: {
    type: String,
    required: true,
    validate: [{
      validator: (link) => validator.isURL(link),
      message: 'Пожалуйста, введите корректную ссылку на изображение',
    },
    ],
  },
  year: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
