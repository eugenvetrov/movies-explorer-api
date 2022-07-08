const User = require('../models/user');
const ServerError = require('../errors/server');
const NotFoundError = require('../errors/notFound');
const BadRequestError = require('../errors/badRequest');

const checkUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }
    return res.send({ data: user });
  }).catch(() => next(new ServerError()));
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        return next(new BadRequestError(`Поле ${fields} заполнено некорректно`));
      }
      return next(new ServerError());
    });
};

module.exports = {
  checkUser,
  updateUser,
};
