/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 let UserService = require('../services/UserService');

module.exports = {
  async allUsers(req, res) {
    const userList = await UserService.getAllUsers();
    return res.json(userList);
  },

  async userByName(req, res) {
    let userName = req.param('name', '');
    let userList = await UserService.getUserByName(userName);
    return res.json(userList);
  },
};
