const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles.js');

articlesRouter.get('/articles', getArticles);
articlesRouter.post('/articles', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(50),
    link: Joi.string().required().pattern(/^https?:\/\/\S+/),
  }),
}), createArticle);

articlesRouter.delete('/articles/:articleId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().pattern(/[\dabcdef]{24}/),
  }),
}), deleteArticle);

module.exports = articlesRouter;
