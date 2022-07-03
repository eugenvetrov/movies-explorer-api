const router = require('express').Router();
const {
  checkUser,
  updateUser,
} = require('../controllers/users');
const { validateUpdateUser } = require('../middlewares/validationByCelebrate');

router.get('/me', checkUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
