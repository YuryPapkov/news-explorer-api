const Article = require('../models/article');
const { addErrorCode } = require('../utils/addErrorCode.js');

module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(addErrorCode(err));
    });
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
  console.log(owner);
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
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err.name);
      next(addErrorCode(err));
    });
};

module.exports.deleteArticle = ((req, res, next) => {
  console.log('del');
  Article.findById(req.params.articleId).select('+owner')
    .orFail(() => { const e = new Error('Карточка не найдена'); e.name = 'NotFound'; return e; })
    .then((article) => {
      if (String(article.owner) !== req.user._id) {
        const e = new Error('Невозможно удалить чужую карточку');
        e.name = 'Forbidden';
        throw e;
      }
      Article.findByIdAndRemove(req.params.articleId)
        .then((articleDeleted) => {
          res.send({ data: articleDeleted });
        });
    })
    .catch((err) => {
      next(addErrorCode(err));
    });
});

// module.exports.addLikeToCard = ((req, res, next) => {
//   Card.findByIdAndUpdate(req.params.cardId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true })
//     .orFail(() => { const e = new Error('Карточка не найдена'); e.name = 'NotFound'; return e; })
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       next(addErrorcode(err));
//     });
// });

// module.exports.deleteLikeFromCard = ((req, res, next) => {
//   Card.findByIdAndUpdate(req.params.cardId,
//     { $pull: { likes: req.user._id } },
//     { new: true })
//     .orFail(() => { const e = new Error('Карточка не найдена'); e.name = 'NotFound'; return e; })
//     .then((card) => res.send({ data: card }))
//     .catch((err) => {
//       next(addErrorcode(err));
//     });
// });