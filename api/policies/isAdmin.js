module.exports = (req, res, proceed) => {
  return req.user.role === 'admin'
    ? proceed()
    : res.send(403).send('Недостаточно прав.');
};
