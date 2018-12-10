const CREATE_NEW_QUESTION_QUERY = 'INSERT INTO consultations (user_id, doctor_id, specialist_id, title, text, time) VALUES ($1, $2, $3, $4, $5, NOW())';
const SELECT_QUESTIONS_FOR_USER_QUERY = `SELECT * FROM consultations WHERE user_id = $1 ORDER BY completed, time`;
const SELECT_QUESTIONS_FOR_DOCTOR_QUERY = `SELECT * FROM consultations WHERE doctor_id = $1 OR specialist_id = $2 ORDER BY completed, time`;
const CLOSE_QUESTION_QUERY = `UPDATE consultations SET completed = true WHERE consultation_id = $1 AND user_id = $2`;
const ADD_ANSWER_QUERY = `INSERT INTO messages (consultation_id, user_id, time, message) VALUES ($1, $2, NOW(), $3)`;

module.exports = {
    async createNewQuestion(params) {
        await sails.sendNativeQuery(
            CREATE_NEW_QUESTION_QUERY,
            [
                params.user_id,
                params.doctor_id,
                params.speciality_id,
                params.title,
                params.text,
            ]
          );
    },

    async getQuestionsForUser(userID) {
        const questionList = await sails.sendNativeQuery(SELECT_QUESTIONS_FOR_USER_QUERY, [userID]);
        return questionList.rows;
    },

    async getQuestionsForDoctor(doctorID, doctorInfo) {
        const questionList = await sails.sendNativeQuery(SELECT_QUESTIONS_FOR_DOCTOR_QUERY, [doctorID, doctorInfo.speciality]);
        return questionList.rows;
    },

    async closeQuestion(questionID, userID) {
        const queryResult = await sails.sendNativeQuery(CLOSE_QUESTION_QUERY, [questionID, userID]);
        return queryResult;
    },

    async addAnswerToQuestion(questionID, params) {
        await sails.sendNativeQuery(ADD_ANSWER_QUERY, [questionID, params.userID, params.message]);
    }


};
