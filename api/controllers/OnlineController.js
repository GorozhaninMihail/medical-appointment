/**
 * OnlineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global sails Speciality Doctor User Consultation */

const QuestionsService = require('../services/QuestionsService');

module.exports = {
  async postAddQuestion(req, res) {
    const {userId, title, text, doctorId, specialityId} = req.body;

    if (!userId || !title || !text) {
      return res.badRequest('Укажите заголовок и текст вашего вопроса.');
    }

    // TODO
    const user = await User.find({id: userId});
    if (!user) {
      return res.badRequest('User not found.');
    }

    if (!doctorId && !specialityId) {
      return res.badRequest("You should send either 'doctor_id' or 'speciality_id' parameter.");
    }

    if (!doctorId && !specialityId) {
      return res.badRequest("You cannot specify both 'doctor_id' and 'speciality_id' parameters.");
    }

    if (doctorId) {
      const doctor = await Doctor.findOne({id: doctorId});

      if (!doctor.length) {
        return res.badRequest('Данный врач не найден.');
      }
    }

    if (specialityId) {
      const speciality = await Speciality.findOne({id: specialityId});

      if (!speciality) {
        return res.notFound('Такой категории не существует.');
      }
    }

    await QuestionsService.createNewQuestion({userId, doctorId, specialityId, title, text});

    return res.sendStatus(201);
  },

  async getAllQuestions(req, res) {
    const {userId, doctorId} = req.query;

    if (!userId && !doctorId) {
      return res.send({});
    }

    let questions;

    if (userId) {
      const user = await User.findOne({id: userId});

      if (!user) {
        return res.send({});
      }

      questions = await QuestionsService.getQuestionsForUser(userId);
    } else if (doctorId) {
      const doctor = await Doctor.findOne({id: doctorId});

      if (!doctor) {
        return res.send({});
      }

      questions = await QuestionsService.getQuestionsForDoctor(
        doctorId,
        doctor,
      );
    }

    return res.json(questions);
  },

  async postCloseQuestion(req, res) {
    const questionId = req.params.id;

    if (!questionId) {
      return res.badRequest('Некорректно указан номер вопроса.');
    }

    const closeResult = await QuestionsService.closeQuestion(questionId, 1); // Заменить 1 на userID

    if (!closeResult.rowCount) {
      return res.badRequest('Такой вопрос не найден.');
    }

    return res.ok();
  },

  async postAddAnswer(req, res) {
    const questionId = req.params.id;
    const {userId, message} = req.body;

    if (!questionId || !userId || !message) {
      return res.badRequest('Отсутствует сообщение.');
    }

    let question = await Consultation.findOne({id: questionId});

    if (!question) {
      return res.badRequest('Данная консультация не существует.');
    }

    if (question.completed) {
      return res.badRequest('Данная консультация закрыта, поэтому ответ на неё добавить невозможно.');
    }

    // const user = await User.findOne({id: userId});

    // TODO
    // if (!user) {
    //   return res.notFound(`User with ID ${body.userID} is not found.`);
    // }

    // TODO
    // await QuestionsService.addAnswerToQuestion(questionId, body);

    return res.sendStatus(201);
  },

  async getQuestionInfo(req, res) {
    const questionId = req.params.id;

    const question = await Consultation.findOne({id: questionId});

    if (!question) {
      return res.badRequest('Данная консультация не найдена.');
    }

    const selectQuestionQuery = 'SELECT * FROM consultations WHERE consultation_id = $1';

    const selectMessagesQuery = 'SELECT * FROM messages WHERE consultation_id = $1 ORDER BY time';

    const questionInfo = {
      question: (await sails.sendNativeQuery(selectQuestionQuery, [questionId])).rows[0],
      messages: (await sails.sendNativeQuery(selectMessagesQuery, [questionId])).rows,
    };

    return res.json(questionInfo);
  },
};
