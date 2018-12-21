/* global User */

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
};
