module.exports = function serverError(err) {
  const {res} = this;

  console.log(err);

  return res.send('Упс, произошла непредвиденная ошибка. Свяжитесь с администратором сайта.');
};
