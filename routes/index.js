const router = require('express').Router();
const {
  celebrate, Joi,
} = require('celebrate');
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

module.exports = router;
