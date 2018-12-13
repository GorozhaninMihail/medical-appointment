const CREATE_ACCOUNT_QUERY = `INSERT INTO users (last_name, first_name, middle_name, email, phone_number, password, type)
    VALUES ($1, $2, $3, $4, $5, $6, $7);`;
const CHANGE_ACCOUNT_ROLE_QUERY = `UPDATE users SET type = $1 WHERE user_id = $2`;
const DELETE_ACCOUNT_QUERY = `DELETE FROM users WHERE user_id = $1`;

module.exports = {
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

    async createAccount(params) {
        let result = 
            await sails.sendNativeQuery(CREATE_ACCOUNT_QUERY, 
                [params.last_name, params.first_name, params.middle_name, params.email, params.phone_number, params.password, params.type]);
        return result;
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

