const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles.js');

articlesRouter.get('/articles', getArticles);
articlesRouter.post('/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.string().required(),
      source: Joi.string().required(),
      link: Joi.string().required().pattern(/^https?:\/\/[\w\d.@:%_+~#=]+\.\w{2,12}$.*/),
      image: Joi.string().required().pattern(/^https?:\/\/[\w\d.@:%_+~#=]+\.\w{2,12}$.*/),
    }),
  }),
  createArticle);

articlesRouter.delete('/articles/:articleId',
  celebrate({
    params: Joi.object().keys({
      articleId: Joi.string().required().pattern(/[\dabcdef]{24}/),
    }),
  }), deleteArticle);

module.exports = articlesRouter;
