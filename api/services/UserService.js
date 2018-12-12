module.exports = {
    async getAllUsers() {
        let userList = await User.find();
        return userList;
    },

    async getUserByName(userName) {
        const userList = await User.find({
            name: {
              contains: userName,
            },
          });
        return userList;
    }

};

