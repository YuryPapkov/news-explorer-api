const Article = require('../models/article');
const Forbidden = require('../utils/errors/forbidden-error.js');
const NotFound = require('../utils/errors/not-found-error.js');
// const InternalError = require('../utils/errors/internal-error.js');

module.exports.getArticles = (req, res, next) => {
  Article.find({ owner: req.user })
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;
  const owner = { _id: req.user._id };
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((card) => {
      Article.findById(card._id)
        .then((article) => res.send({ data: article }));
    })
    .catch(next);
};

module.exports.deleteArticle = ((req, res, next) => {
  Article.findById(req.params.articleId).select('+owner')
    .orFail(() => {
      throw new NotFound('Публикация не найдена');
    })
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        throw new Forbidden('Невозможно удалить чужую публикацию');
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((articleDeleted) => {
          res.send({ data: articleDeleted });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch(next);
});
