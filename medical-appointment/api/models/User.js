/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'users',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'number',
      unique: true,
      columnName: 'userID',
      autoIncrement: true
    },
    last_name: {
      type: 'string',
      required: true
    },
    first_name: {
      type: 'string',
      required: true
    },
    middle_name: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
    },
    phone_number: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    }

  },

};

