/* eslint-disable camelcase */
/**
 * OnlineController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global sails Speciality Doctor Consultation Message */

const moment = require('moment');
const _ = require('lodash');
const QuestionsService = require('../services/QuestionsService');

module.exports = {
  async postAddQuestion(req, res) {
    const {title, message, doctorId, specialityId} = req.body;

    if (!title || !message) {
      return res.badRequest('Укажите заголовок и текст вашего вопроса.');
    }

    const userId = req.user.id;

    if (!doctorId && !specialityId) {
      return res.badRequest('Некорректные данные');
    }

    if (doctorId) {
      const doctor = await Doctor.findOne({id: doctorId});

      if (!doctor) {
        return res.badRequest('Данный врач не найден.');
      }
    } else if (specialityId) {
      const speciality = await Speciality.findOne({id: specialityId});

      if (!speciality) {
        return res.notFound('Такой категории не существует.');
      }
    }

    await QuestionsService.createNewQuestion({
      userId,
      doctorId,
      specialityId,
      title,
      text: message,
    });

    return res.status(201).send();
  },

  async getAllQuestions(req, res) {
    const {role, id} = req.user;

    let questions = [];

    if (role === 'doctor') {
      const doctor = await Doctor.findOne({id});

      const questionsForDoctor = await QuestionsService.getQuestionsForDoctor(id, doctor);

      questions.push(...questionsForDoctor);
    }

    const questionsByUser = await QuestionsService.getQuestionsForUser(id);

    questions.push(...questionsByUser);

    questions = _.uniqWith(questions, _.isEqual);

    return res.json(questions);
  },

  async postCloseQuestion(req, res) {
    const {user} = req;

    const questionId = req.params.id;

    if (!questionId) {
      return res.badRequest('Некорректно указан номер вопроса.');
    }

    const question = await Consultation.findOne({id: questionId});

    if (!question
      || !(await QuestionsService.checkPermissions(user, question))
      || question.completed) {
      return res.badRequest('Вы не можете закрыть данный вопрос.');
    }

    await QuestionsService.closeQuestion(questionId);

    return res.status(200).send();
  },

  async postAddAnswer(req, res) {
    const {user} = req;
    const {id: userId} = user;
    const questionId = req.params.id;
    const {message} = req.body;

    if (!questionId || !message) {
      return res.badRequest('Отсутствует сообщение.');
    }

    let question = await Consultation.findOne({id: questionId});

    if (!question
      || !(await QuestionsService.checkPermissions(user, question))
      || question.completed) {
      return res.badRequest('Вы не можете добавить ответ на данный вопрос.');
    }

    const result = await Message.create({
      consultationId: questionId,
      userId,
      time: moment.utc().format(),
      message,
    }).fetch();

    return res.json(result);
  },

  async getQuestionInfo(req, res) {
    const {user} = req;
    const questionId = req.params.id;

    const question = await Consultation.findOne({id: questionId});

    if (!question) {
      return res.badRequest('Данная консультация не найдена.');
    }

    if (!(await QuestionsService.checkPermissions(user, question))) {
      return res.badRequest('Вы не можете просматривать данный вопрос.');
    }

    const selectMessagesQuery = 'SELECT * FROM messages WHERE consultation_id = $1 ORDER BY time';

    const messages = (await sails.sendNativeQuery(
      selectMessagesQuery,
      [questionId],
    )).rows.map(({consultation_id, user_id, ...rest}) => ({
      consultationId: consultation_id,
      userId: user_id,
      ...rest,
    }));

    const questionInfo = {
      question,
      messages,
    };

    return res.json(questionInfo);
  },
};
