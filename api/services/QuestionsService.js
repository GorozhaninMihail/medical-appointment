const createNewQuestionDoctorQuery = `INSERT INTO consultations (user_id, doctor_id, specialist_id, title, text, time)
VALUES ($1, $2, $3, $4, $5, NOW())`;

const selectQuestionsForUserQuery = `SELECT *
FROM consultations
WHERE user_id = $1
ORDER BY completed, time`;

const selectQuestionsForDoctorQuery = `SELECT *
FROM consultations
WHERE doctor_id = $1 OR (doctor_id IS NULL AND specialist_id = $2)
ORDER BY completed, time`;

const closeQuestionQuery = `UPDATE consultations
SET completed = true
WHERE consultation_id = $1`;

const addAnswerQuery = `INSERT INTO messages (consultation_id, user_id, time, message)
VALUES ($1, $2, NOW(), $3)`;

/* global sails Doctor */

module.exports = {
  async createNewQuestion({userId, doctorId, specialityId, title, text}) {
    return await sails.sendNativeQuery(createNewQuestionDoctorQuery, [
      userId,
      doctorId || null,
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

  async closeQuestion(questionId) {
    const queryResult = await sails.sendNativeQuery(closeQuestionQuery, [
      questionId,
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

  // Returns true if permissions is ok
  async checkPermissions(user, question) {
    const {id: userId} = user;
    let doctorInfo = {};

    if (user.role === 'doctor') {
      doctorInfo = await Doctor.findOne({
        id: userId,
      });
    }

    return !(question.userId !== userId
      && question.doctorId !== userId
      && (!question.doctorId
        && doctorInfo.speciality !== question.specialityId));
  },
};
