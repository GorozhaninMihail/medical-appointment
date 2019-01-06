/**
 * Message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'messages',

  attributes: {
    consultationId: {
      columnName: 'consultation_id',
      type: 'number',
    },

    userId: {
      columnName: 'user_id',
      type: 'number',
    },

    time: {
      type: 'string',
    },

    message: {
      type: 'string',
    },
  },
};
