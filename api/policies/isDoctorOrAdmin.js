module.exports = (req, res, proceed) => {
  const {role} = req.user;

  return ['doctor', 'admin'].includes(role)
    ? proceed()
    : res.send(403).send('Недостаточно прав.');
};
