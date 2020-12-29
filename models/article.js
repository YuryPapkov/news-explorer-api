const mongoose = require('mongoose');
const valid = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
      message: 'Некорректный URL',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return valid.isURL(v);
      },
      message: 'Некорректный URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    select: false,
  },
});
module.exports = mongoose.model('article', articleSchema);
