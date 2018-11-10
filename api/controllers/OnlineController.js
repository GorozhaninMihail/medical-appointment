/**
 * OnlineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async addQuestion(req, res) {
    let body = req.body;
    let result = sails.helpers.parametersCheck(req, ['user_id', 'title', 'text']);
    if(result.error) return res.badRequest(result.error);

    let user = await User.find({id: body.user_id});
    if(user.length === 0) return res.notFound('User with ID ' + body.user_id + ' is not found.');

    if(!body.doctor_id && !body.speciality_id)
      return res.notFound("You should send either 'doctor_id' or 'speciality_id' parameter.");
    else if(body.doctor_id && body.speciality_id)
      return res.notFound("You cannot specify both 'doctor_id' and 'speciality_id' parameters.");
    else if(body.doctor_id) {
      let doctor = await Doctor.find({id: body.doctor_id});
      if(doctor.length === 0) return res.notFound('Doctor with ID ' + body.doctor_id + ' is not found.');
    }
    else if(body.speciality_id) {
      let speciality = await Speciality.find({id: body.speciality_id});
      if(speciality.length === 0) return res.notFound('Speciality with ID ' + body.speciality_id + ' is not found.');
    }

    await sails.sendNativeQuery('INSERT INTO consultations (user_id, doctor_id, specialist_id, title, text, time) ' +
      'VALUES ($1, $2, $3, $4, $5, NOW())',
      [body.user_id, body.doctor_id, body.speciality_id, body.title, body.text]);
    return res.sendStatus(201);
  },

  async getQuestions(req, res) {
    let userID = req.param('user', null);
    let doctorID = req.param('doctor', null);
    if(!userID && !doctorID) {
      return res.badRequest("You should specify either 'user' or 'receiver' parameter");
    }
    let questions;
    if(userID) {
      let user = await User.findOne({id: userID});
      if(!user) return res.notFound(`User with ID ${userID} is not found.`);
      const SELECT_QUESTIONS_QUERY = `SELECT * FROM consultations 
        WHERE user_id = $1
        ORDER BY completed DESC, time`;
      questions = await sails.sendNativeQuery(SELECT_QUESTIONS_QUERY, [userID]);
    }
    else if(doctorID) {
      let doctor = await Doctor.findOne({id: doctorID});
      if(!doctor) return res.notFound(`Doctor with ID ${doctorID} is not found.`);

      const SELECT_QUESTIONS_QUERY = `SELECT * FROM consultations 
        WHERE doctor_id = $1 OR specialist_id = $2
        ORDER BY completed DESC, time`;
      questions = await sails.sendNativeQuery(SELECT_QUESTIONS_QUERY, [doctorID, doctor.speciality]);
    }
    return res.json(questions.rows);
  },

  async closeQuestion(req, res) {
    const questionID = parseInt(req.param('id'));

    const CLOSE_QUESTION_QUERY = `UPDATE consultations 
        SET completed = true
        WHERE consultation_id = $1 AND user_id = 1`;
    let queryResult = await sails.sendNativeQuery(CLOSE_QUESTION_QUERY, [questionID]);
    if(!queryResult.rowCount) return res.notFound('Question not found');
    return res.ok();
  }

};

