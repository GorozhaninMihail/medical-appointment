/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global sails */

module.exports = {
  async getStats(req, res) {
    const consultationsCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM consultations',
    )).rows[0].count;

    const consultationsMade = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM consultations WHERE completed = true',
    )).rows[0].count;

    const doctorsCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM doctors',
    )).rows[0].count;

    const clinicsCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM medical_centres',
    )).rows[0].count;

    const ordersCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM orders',
    )).rows[0].count;

    const ordersCompleted = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM orders WHERE status = 1',
    )).rows[0].count;

    const specialitiesCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM specialities',
    )).rows[0].count;

    const userCount = (await sails.sendNativeQuery(
      'SELECT COUNT(*) FROM users WHERE type = $1',
      ['user'],
    )).rows[0].count;

    return res.send({
      consultationsCount,
      consultationsMade,
      doctorsCount,
      clinicsCount,
      ordersCount,
      ordersCompleted,
      specialitiesCount,
      userCount,
    });
  },

  async postAddSpeciality(req, res) {
    const {name} = req.body;

    if (!name || name.length < 3) {
      return res.badRequest('Название специальности слишком короткое.');
    }

    const existingSpeciality = (await sails.sendNativeQuery(
      'SELECT * FROM specialities WHERE name = $1',
      [name],
    )).rows[0];

    if (existingSpeciality) {
      return res.badRequest('Специальность с таким именем уже существует.');
    }

    await sails.sendNativeQuery(
      'INSERT INTO specialities (name) VALUES ($1)',
      [name],
    );

    return res.status(201).send();
  },
};
