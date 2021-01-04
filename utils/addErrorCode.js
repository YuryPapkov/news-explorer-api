/* eslint-disable no-param-reassign */
module.exports.addErrorCode = (err) => {
  let errorCode;
  // if (err.message) {
  //   switch (true) {
  //     case (err.message === 'Пользователь не найден'):
  //     case (err.message === 'Карточка не найдена'):
  //       errorCode = 404;
  //       break;
  //     case (/^(E11000).+/gm).test(err.message):
  //       errorCode = 409;
  //       break;
  //     case (/^(article validation failed).+/gm).test(err.message):
  //       errorCode = 400;
  //       break;
  //     case (err.message === 'Невозможно удалить чужую карточку'):
  //       errorCode = 403;
  //       break;
  //     case (err.message === 'Неправильный email или пароль'):
  //       errorCode = 401;
  //       break;
  //     default:
  //       errorCode = 500;
  //   }
  //   err.statusCode = errorCode;
  //   return err;
  // }
  switch (err.name) {
    case 'ValidationError':
      errorCode = 400;
      break;
    case 'CastError':
    case 'NotFound':
      errorCode = 404;
      break;
    case 'MongoError':
      errorCode = 409;
      err.message = 'Ошибка записи в БД';
      break;
    default:
      errorCode = 500;
  }
  err.statusCode = errorCode;
  return err;
};
