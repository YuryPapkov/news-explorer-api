const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/auth-error.js');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthError('Ошибка авторизации!-нет токена');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthError('Ошибка авторизации!- токен не правильный');
  }
  req.user = payload;
  next();
};
