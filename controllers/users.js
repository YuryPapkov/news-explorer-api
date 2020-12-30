const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { addErrorCode } = require('../utils/addErrorCode.js');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => { const e = new Error('Пользователь не найден'); e.name = 'NotFound'; throw e; })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      next(addErrorCode(err));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))

    .then((user) => res.send({ data: { name: user.name, email: user.email } }))
    .catch((err) => {
      console.log(err.message);
      next(addErrorCode(err));
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password') // делаем доступным password из БД
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильный email или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильный email или пароль'));
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.send({ token });
          return null;
        })
        .catch((err) => {
          next(addErrorCode(err));
        });
    });
};

// module.exports.getUsers = (req, res, next) => {
//   User.find({})
//     .then((users) => res.send({ data: users }))
//     .catch(next);
// };

// module.exports.getUserById = (req, res, next) => {
//   User.findById(req.params.userId)
//     .orFail(() => { const e = new Error('Пользователь не найден'); e.name = 'NotFound'; return e; })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       next(addErrorCode(err));
//     });
// };

// module.exports.updateUser = (req, res, next) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
//     .orFail(() => { const e = new Error('Пользователь не найден'); e.name = 'NotFound'; return e; })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       next(addErrorCode(err));
//     });
// };

// module.exports.updateUserAvatar = (req, res, next) => {
//   const { avatar } = req.body;
//   User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
//     .orFail(() => { const e = new Error('Пользователь не найден'); e.name = 'NotFound'; return e; })
//     .then((user) => res.send({ data: user }))
//     .catch((err) => {
//       next(addErrorCode(err));
//     });
// };
