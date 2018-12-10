/**
 * OnlineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var QuestionsService = require('../services/QuestionsService');

module.exports = {
  async addQuestion(req, res) {
    const {body} = req;

    const result = sails.helpers.parametersCheck(req, ['user_id', 'title', 'text']);
    if (result.error) {
      return res.badRequest(result.error);
    }

    const user = await User.find({id: body.user_id});
    if (!user) {
      return res.notFound('Such a user was not found.');
    }

    if (!body.doctor_id && !body.speciality_id) {
      return res.notFound("You should send either 'doctor_id' or 'speciality_id' parameter.");
    }

    if (body.doctor_id && body.speciality_id) {
      return res.notFound("You cannot specify both 'doctor_id' and 'speciality_id' parameters.");
    }

    if (body.doctor_id) {
      const doctor = await Doctor.find({id: body.doctor_id});

      if (doctor.length === 0) {
        return res.notFound(`Doctor with ID ${body.doctor_id} is not found.`);
      }
    }

    if (body.speciality_id) {
      const speciality = await Speciality.find({id: body.speciality_id});

      if (speciality.length === 0) {
        return res.notFound(`Speciality with ID ${body.speciality_id} is not found.`);
      }
    }

    await QuestionsService.createNewQuestion(body);
    return res.sendStatus(201);
  },

  async getQuestions(req, res) {
    const userID = req.param('user', null);
    const doctorID = req.param('doctor', null);

    if (!userID && !doctorID) {
      return res.badRequest("You should specify either 'user' or 'receiver' parameter");
    }

    let questions;

    if (userID) {
      const user = await User.findOne({id: userID});

      if (!user) {
        return res.notFound(`User with ID ${userID} is not found.`);
      }

      questions = await QuestionsService.getQuestionsForUser(userID);
    } else if (doctorID) {
      const doctor = await Doctor.findOne({id: doctorID});
      if (!doctor) {
        return res.notFound(`Doctor with ID ${doctorID} is not found.`);
      }
      questions = await QuestionsService.getQuestionsForDoctor(doctorID, doctor);
    }
    return res.json(questions);
  },

  async closeQuestion(req, res) {
    const questionID = Number(req.param('id'));
    const closeResult = await QuestionsService.closeQuestion(questionID, 1); // Заменить 1 на userID
    if(!closeResult.rowCount) {
      return res.notFound('Question not found');
    }
    return res.ok();
  },

  async addAnswer(req, res) {
    const questionID = Number(req.param('id'));

    let question = await Consultation.findOne({id: questionID});

    if (!question) {
      return res.notFound(`Online consultation question with ID ${questionID} is not found.`);
    }

    if (question.completed) {
      return res.forbidden(`Online consultation question with ID ${questionID} is already closed.`);
    }

    const {body} = req;

    const result = sails.helpers.parametersCheck(req, ['userID', 'message']);

    if (result.error) {
      return res.badRequest(result.error);
    }

    const user = await User.findOne({id: body.userID});

    if (!user) {
      return res.notFound(`User with ID ${body.userID} is not found.`);
    }

    await QuestionsService.addAnswerToQuestion(questionID, body);

    return res.sendStatus(201);
  },

  async getQuestionInfo(req, res) {
    const questionID = Number(req.param('id'));

    const question = await Consultation.findOne({id: questionID});

    if (!question) {
      return res.notFound(`Online consultation question with ID ${questionID} is not found.`);
    }

    let questionInfo = {};

    const selectQuestion = 'SELECT * FROM consultations WHERE consultation_id = $1';

    const selectMessages = 'SELECT * FROM messages WHERE consultation_id = $1 ORDER BY time';

    questionInfo.question = (await sails.sendNativeQuery(selectQuestion, [questionID])).rows[0];
    questionInfo.messaged = (await sails.sendNativeQuery(selectMessages, [questionID])).rows;
    return res.json(questionInfo);
  },
};

