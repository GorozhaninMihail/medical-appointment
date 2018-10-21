/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  all_users: async function(req, res) {
    let userList = await User.find();
    return res.json(userList);
  },

  find_users_by_name: async function(req, res) {
    let userList = await User.find({
      name: {
        contains: req.param('name', '')
      }
    });
    return res.json(userList);
  }
};
