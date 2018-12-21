/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global User */

 let UserService = require('../services/UserService');

module.exports = {
  async getAllUsers(req, res) {
    const userList = await User.find();

    return res.json(userList);
  },

  async getUsersByName(req, res) {
    const userList = await User.find({
      name: {
        contains: req.param('name', ''),
      },
    });

    return res.json(userList);
  },
};
