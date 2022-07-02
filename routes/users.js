const router = require('express').Router();
const {
  celebrate, Joi,
} = require('celebrate');
const validator = require('validator');
const {
  checkUser,
  updateUser,
} = require('../controllers/users');
const BadRequestError = require('../errors/badRequest');

const validateEmail = (value) => {
  if (!validator.isEmail(value, { require_protocol: true })) {
    throw new BadRequestError('Неправильный формат email');
  }
  return value;
};

router.get('/me', checkUser);
router.patch('/me', celebrate({
  body: {
    name: Joi.string().min(1).max(30).required(),
    email: Joi.string().custom(validateEmail).required(),
  },
}), updateUser);

module.exports = router;
