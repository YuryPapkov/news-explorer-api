const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/auth-error.js');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthError('Ошибка авторизации!-нет токена');
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthError('Ошибка авторизации!- токен не правильный');
    // return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
