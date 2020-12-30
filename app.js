const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const router = require('./routes/index.js');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth.js');

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/[\d\w.-_]+@[\d\w._-]+/),
    password: Joi.string().required().min(2).max(30),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/[\d\w.-_]+@[\d\w._-]+/),
    password: Joi.string().required().min(2).max(30),
    name: Joi.string().min(2).max(30),

  }),
}), createUser);
app.use(auth);
app.use('/', router);
// app.use(express.static(path.join(__dirname, 'public')));
app.use('*', (req, res) => { res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }); });
app.use(errorLogger);
// // обработка ошибок
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка на сервере' : message });
  next();
});

app.listen(PORT, () => {
  console.log('Listening Port 3000');
});
