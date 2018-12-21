const createNewQuestionQuery = `
INSERT INTO consultations (user_id, doctor_id, specialist_id, title, text, time)
VALUES ($1, $2, $3, $4, $5, NOW())`;

const selectQuestionsForUserQuery = 'SELECT * FROM consultations WHERE user_id = $1 ORDER BY completed, time';

const selectQuestionsForDoctorQuery = 'SELECT * FROM consultations WHERE doctor_id = $1 OR specialist_id = $2 ORDER BY completed, time';

const closeQuestionQuery = 'UPDATE consultations SET completed = true WHERE consultation_id = $1 AND user_id = $2';

const addAnswerQuery = 'INSERT INTO messages (consultation_id, user_id, time, message) VALUES ($1, $2, NOW(), $3)';

/* global sails */

module.exports = {
  async createNewQuestion({userId, doctorId, specialityId, title, text}) {
    return await sails.sendNativeQuery(createNewQuestionQuery, [
      userId,
      doctorId,
      specialityId,
      title,
      text,
    ]);
  },

  async getQuestionsForUser(userId) {
    const questionList = await sails.sendNativeQuery(
      selectQuestionsForUserQuery,
      [userId],
    );

    return questionList.rows;
  },

  async getQuestionsForDoctor(doctorId, doctorInfo) {
    const questionList = await sails.sendNativeQuery(
      selectQuestionsForDoctorQuery,
      [doctorId, doctorInfo.speciality],
    );

    return questionList.rows;
  },

  async closeQuestion(questionId, userId) {
    const queryResult = await sails.sendNativeQuery(closeQuestionQuery, [
      questionId,
      userId,
    ]);

    return queryResult;
  },

  async addAnswerToQuestion({questionId, userId, message}) {
    return await sails.sendNativeQuery(addAnswerQuery, [
      questionId,
      userId,
      message,
    ]);
  },
};
