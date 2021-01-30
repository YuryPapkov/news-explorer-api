const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/newsdb' } = process.env;
const app = express();
// const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const limiter = require('./middlewares/rate-limitter.js');
const commonErrorHandler = require('./middlewares/common-error-handler.js');
const router = require('./routes/index.js');
const NotFound = require('./utils/errors/not-found-error.js');

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());
app.use(requestLogger);
app.use(limiter);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,append,delete,entries,foreach,get,has,keys,set,values,Authorization');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, HEAD, PUT, PATCH, POST, DELETE');
  res.status(200);
  next();
});
app.options('*', (req, res) => { res.status(200).send(); });
// app.use(helmet());
app.use('/api', router);
app.use('*', () => {
  throw new NotFound('Запрашиваемый ресурс не найден');
});
app.use(errorLogger);
// обработка ошибок celebrate
app.use(errors());
// обработка ошибок централизованная
app.use(commonErrorHandler);
app.listen(PORT, () => {
  // console.log('Listening Port ', PORT);
});
