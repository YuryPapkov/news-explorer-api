const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const articlesRouter = require('./articles.js');
const usersRouter = require('./users.js');
const { login, createUser } = require('../controllers/users.js');
const { auth } = require('../middlewares/auth.js');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/[\d\w.-_]+@[\d\w]+[\d\w.-_]*\.[\w]{2,12}$/),
    password: Joi.string().required().min(2),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/[\d\w.-_]+@[\d\w]+[\d\w.-_]*\.[\w]{2,12}$/),
    password: Joi.string().required().min(2),
    name: Joi.string().required().min(2),
  }),
}), createUser);
router.use(auth);
router.use('/', articlesRouter, usersRouter);

module.exports = router;
