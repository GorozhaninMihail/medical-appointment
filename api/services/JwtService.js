/* global sails */

const jwt = require('jsonwebtoken');

const {jwtSecret} = sails.config.custom;

module.exports = {
  generateTokenForUser(user) {
    const {
      id,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName = '',
      email,
      phone_number: phone,
      type: role,
    } = user;

    const payload = {
      id,
      firstName,
      lastName,
      middleName,
      email,
      phone,
      role,
    };

    return jwt.sign(payload, jwtSecret, {
      expiresIn: '7d',
    });
  },
};
