const router = require('express').Router();
const {
  celebrate, Joi,
} = require('celebrate');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFound');
const {
  createUser, login, clearCookie,
} = require('../controllers/auth');

router.post('/signup', celebrate({
  body: {
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), createUser);
router.post('/signin', celebrate({
  body: {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  },
}), login);
router.get('/signout', clearCookie);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Такой запрос не найден'));
});

module.exports = router;
