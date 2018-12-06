/**
 * Doctor.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'doctors',
  primaryKey: 'id',

  attributes: {

    id: {
      columnName: 'doctor_id',
      type: 'number',
      autoIncrement: true
    },
    speciality: {
      type: 'number',
      columnName: 'speciality_id'
    },
    experience: {
      type: 'number'
    },
    information: {
      type: 'string',
      allowNull: true
    }

  },

};

