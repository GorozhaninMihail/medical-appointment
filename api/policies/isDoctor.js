module.exports = (req, res, proceed) => {
  return req.user.role === 'doctor'
    ? proceed()
    : res.send(403).send('Недостаточно прав.');
};
