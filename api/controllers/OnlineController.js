/**
 * OnlineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  add_question: async function(req, res) {
    let body = req.body;
    let result = sails.helpers.parametersCheck(req, ['user_id', 'title', 'text']);
    if(result.error) return res.badRequest(result.error);

    let user = await User.find({id: body.user_id});
    if(user.length === 0) return res.notFound('User with ID ' + body.user_id + ' is not found.');

    if(body.doctor_id !== undefined) {
      let doctor = await Doctor.find({id: body.doctor_id});
      if(doctor.length === 0) return res.notFound('Doctor with ID ' + body.doctor_id + ' is not found.');
    }
    if(body.speciality_id !== undefined) {
      let doctor = await Doctor.find({id: body.doctor_id});
      if(doctor.length === 0) return res.notFound('Doctor with ID ' + body.doctor_id + ' is not found.');
    }

    sails.sendNativeQuery('INSERT INTO consultations (user_id, doctor_id, specialist_id, title, text, time) ' +
      'VALUES ($1, $2, $3, $4, $5, NOW())',
      [body.user_id, body.doctor_id, body.speciality, body.title, body.text]);
    return res.ok();
  }

};

