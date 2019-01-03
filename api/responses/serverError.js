module.exports = function serverError(err) {
  const {res} = this;

  console.log(err);

  return res.status(500).json('Упс, произошла непредвиденная ошибка. Свяжитесь с администратором сайта.');
};
