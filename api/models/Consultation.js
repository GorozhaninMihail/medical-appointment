/**
 * Consultation.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'consultations',
  primaryKey: 'id',

  attributes: {
    id: {
      columnName: 'consultation_id',
      type: 'number',
      autoIncrement: true,
    },

    userId: {
      columnName: 'user_id',
      type: 'number',
    },

    doctorId: {
      columnName: 'doctor_id',
      type: 'number',
      allowNull: true,
    },

    specialityId: {
      type: 'number',
      columnName: 'specialist_id',
      allowNull: true,
    },

    title: {
      type: 'string',
    },

    text: {
      type: 'string',
    },

    completed: {
      type: 'boolean',
    },
  },
};
