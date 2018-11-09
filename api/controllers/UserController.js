/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async allUsers(req, res) {
    const userList = await User.find();
    return res.json(userList);
  },

  async userByName(req, res) {
    const userList = await User.find({
      name: {
        contains: req.param('name', '')
      }
    });
    return res.json(userList);
  }
};
