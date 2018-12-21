/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const Joi = require('joi');
const UserService = require('../services/UserService');
const JwtService = require('../services/JwtService');

module.exports = {
  async postLogin(req, res) {
    const {id, password} = req.body;

    if (!id || !password) {
      return res.badRequest('Укажите данные для входа.');
    }

    const user = await UserService.findUser({
      email: id,
      phone: id,
    });

    if (!user
        || user.password !== password) {
      return res.badRequest('Не удаётся найти пользователя с такими учётными данными.');
    }

    const token = JwtService.generateTokenForUser(user);

    return res.send({token});
  },

  async postSignup(req, res) {
    const {firstName, lastName, middleName, email, phone, password} = req.body;

    const data = {firstName, lastName, middleName, email, phone, password};

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.badRequest('Все обязательные поля должны быть заполнены.');
    }

    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      middleName: Joi.string(),
      email: Joi.string().email().required(),
      phone: Joi.string().regex(/^\+7\d{10}$/).required(),
      password: Joi.string().token().min(6).max(40).required(),
    });

    const {error} = Joi.validate(data, schema);

    if (error) {
      return res.badRequest('E-mail, номер телефона или пароль указаны неправильно. Поддерживаются только номера из РФ. Допустимая длина пароля: 6-40 символов.');
    }

    const user = await UserService.addUser(data);

    if (!user) {
      return res.badRequest('Пользователь с такими данными уже зарегистрирован.');
    }

    const token = JwtService.generateTokenForUser(user);

    return res.send({token});
  },

  getCurrentUser(req, res) {
    return res.json(req.user);
  },

  // async postLogout(req, res) {
  // }
};
