const usersRouter = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { getCurrentUser } = require('../controllers/users');

// usersRouter.get('/users', getUsers);

usersRouter.get('/users/me', getCurrentUser);

// usersRouter.get('/users/:userId', celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().required().pattern(/[\dabcdef]{24}/),
//   }),
// }), getUserById);

// usersRouter.patch('/users/me', celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30),
//     about: Joi.string().required().min(2).max(30),
//   }),
// }), updateUser);

// usersRouter.patch('/users/avatar', celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().required().pattern(/^https?:\/\/\S+/),
//   }),
// }), updateUserAvatar);

module.exports = usersRouter;
