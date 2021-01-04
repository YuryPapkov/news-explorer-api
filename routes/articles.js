const articlesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles.js');

articlesRouter.get('/articles', getArticles);
articlesRouter.post('/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required().min(2),
      title: Joi.string().required().min(2),
      text: Joi.string().required().min(2),
      date: Joi.string().required().min(2),
      source: Joi.string().required().min(2),
      link: Joi.string().required().pattern(/^https?:\/\/[\w\d.@:%_+~#=]+\.\w{2,4}$/),
      image: Joi.string().required().pattern(/^https?:\/\/[\w\d.@:%_+~#=]+\.\w{2,4}$/),
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
