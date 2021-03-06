/**
 * Speciality.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'specialities',
  primaryKey: 'id',

  attributes: {
    id: {
      type: 'number',
      unique: true,
      columnName: 'speciality_id',
      autoIncrement: true,
    },

    name: {
      type: 'string',
      required: true,
      unique: true,
    },
  },
};
