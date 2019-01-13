/**
 * Clinic.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'medical_centres',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      unique: true,
      autoIncrement: true,
    },

    name: {
      type: 'string',
      required: true,
    },

    description: {
      type: 'string',
      allowNull: true,
    },

    address: {
      type: 'string',
      required: true,
    },
  },
};
