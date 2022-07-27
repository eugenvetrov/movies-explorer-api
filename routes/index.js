const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFound');
const {
  createUser, login, clearCookie,
} = require('../controllers/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validationByCelebrate');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);
router.get('/signout', clearCookie);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', auth, (req, res, next) => {
  next(new NotFoundError('Такой запрос не найден'));
});

module.exports = router;
