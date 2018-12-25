/* global User */
const CHANGE_ACCOUNT_ROLE_QUERY = `UPDATE users SET type = $1 WHERE user_id = $2`;
const DELETE_ACCOUNT_QUERY = `DELETE FROM users WHERE user_id = $1`;

module.exports = {
  async addUser({
    firstName,
    lastName,
    middleName = '',
    email,
    phone,
    password,
    type = 'user',
  }) {
    const existingUser = await this.findUser({email, phone});

    if (existingUser) {
      return null;
    }

    const createdUser = await User.create({
      last_name: lastName,
      first_name: firstName,
      middle_name: middleName,
      email,
      phone_number: phone,
      password,
      type,
    }).fetch();

    return createdUser;
  },

  async findUser({email, phone = email}) {
    return await User.findOne({email})
      || await User.findOne({phone_number: phone});
  },

  async getAllUsers() {
    let userList = await User.find();
    return userList;
  },

  async getUserByName(userName) {
    const userList = await User.find({
        last_name: {
          contains: userName,
        },
      });
    return userList;
  },

  async setUserRole(userID, role) {
    let result = await sails.sendNativeQuery(CHANGE_ACCOUNT_ROLE_QUERY, [role, userID]); 
    return result;
  },

  async deleteAccount(userID) {
    let result = await sails.sendNativeQuery(DELETE_ACCOUNT_QUERY, [userID]);
    return result;
  }
};
