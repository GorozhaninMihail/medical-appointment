module.exports = (req, res, proceed) => {
  if (req.user) {
    return proceed();
  }

  return res.status(401).send('Недостаточно прав.');
};
