const router = require('express').Router();
const {
  celebrate, Joi,
} = require('celebrate');
const {
  checkUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', checkUser);
router.patch('/me', celebrate({
  body: {
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  },
}), updateUser);

module.exports = router;
