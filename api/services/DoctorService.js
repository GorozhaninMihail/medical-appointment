/* global sails */

const doctorsSelectQuery = (whereClause = '') => `
SELECT doctors.*, specialities.name AS speciality,
users.last_name, users.first_name, users.middle_name
FROM doctors
JOIN specialities ON specialities.speciality_id = doctors.speciality_id
JOIN users ON users.user_id = doctors.doctor_id
${whereClause}
ORDER BY doctors.doctor_id`;

const doctorsClinicsQuery = 'SELECT * FROM doctors_centres ORDER BY doctor_id';

const doctorTimesheetQuery = 'SELECT mc_id, date, start FROM timesheet WHERE doctor_id = $1 AND date >= current_date';

const SELECT_DOCTOR_TIMESHEET_QUERY = `SELECT timesheet.*, orders.patient_id FROM timesheet
  LEFT JOIN orders ON (orders.mc_id, orders.doctor_id, orders.date, orders.time) = (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start)
  WHERE (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start) = ($1, $2, $3, $4)`;

const createNewOrderQuery = 'INSERT INTO orders (mc_id, doctor_id, date, time, patient_id, description, status) VALUES ($1, $2, $3, $4, $5, $6, 0)';

const cancelOrderQuery = 'DELETE FROM orders WHERE (orders.mc_id, orders.doctor_id, orders.date, orders.time, orders.patient_id) = ($1, $2, $3, $4, $5)';

const changeOrderStatusQuery = 'UPDATE orders SET status = $1 WHERE (mc_id, doctor_id, date, time, patient_id) = ($2, $3, $4, $5, $6)';

const userOrdersQuery = `SELECT orders.date, orders.time, orders.status, mc.name AS mc_name, mc.address, specialities.name, users.last_name, users.first_name, users.middle_name
  FROM orders
  LEFT JOIN medical_centres mc ON mc.id = orders.mc_id
  LEFT JOIN doctors ON doctors.doctor_id = orders.doctor_id
  JOIN users ON users.user_id = doctors.doctor_id
  LEFT JOIN specialities ON specialities.speciality_id = doctors.speciality_id
  WHERE orders.patient_id = $1
  ORDER BY orders.date DESC, orders.time DESC`;

const SELECT_DUPLICATE_TIMESHEET_QUERY = `SELECT doctor_id, date, start FROM timesheet GROUP BY doctor_id, date, start HAVING count(*) > 1`;
const SELECT_WRONG_ORDERS_QUERY = `SELECT mc_id, doctor_id, date FROM orders WHERE (mc_id, doctor_id, date, time) NOT IN (SELECT mc_id, doctor_id, date, start FROM timesheet)`;

module.exports = {
  async getAllDoctors() {
    const doctorSelectResult = await sails.sendNativeQuery(
      doctorsSelectQuery(),
    );

    const doctorsToClinics = await sails.sendNativeQuery(
      doctorsClinicsQuery,
    );

    const doctorToClinicsRows = doctorsToClinics.rows;

    let i = 0;

    doctorSelectResult.rows.forEach(doctor => {
      // Список клиник для каждого доктора
      let clinics = [];
      while (
        i < doctorToClinicsRows.length
          && doctorToClinicsRows[i].doctor_id === doctor.doctor_id
      ) {
        clinics.push(doctorToClinicsRows[i].centre_id);
        i++;
      }

      doctor.clinics = clinics;
    });

    return doctorSelectResult.rows;
  },

  async getDoctorsByClinicID(clinicId) {
    const whereClause = 'WHERE doctors.doctor_id IN (SELECT doctor_id FROM doctors_centres WHERE centre_id = $1)';

    const doctorList = await sails.sendNativeQuery(
      doctorsSelectQuery(whereClause),
      [clinicId],
    );

    return doctorList.rows;
  },

  async getDoctorInfo(doctorId) {
    const whereClause = 'WHERE doctors.doctor_id = $1';

    const doctor = await sails.sendNativeQuery(
      doctorsSelectQuery(whereClause),
      [doctorId],
    );

    if (!doctor.rowCount) {
      return null;
    }

    const timesheet = await sails.sendNativeQuery(doctorTimesheetQuery, [
      doctorId,
    ]);

    doctor.rows[0].timesheet = timesheet.rows;

    return doctor.rows[0];
  },

  async getDoctorTime({clinicId, doctorId, date, time}) {
    const doctorOrder = await sails.sendNativeQuery(
      SELECT_DOCTOR_TIMESHEET_QUERY,
      [clinicId, doctorId, date, time],
    );

    return doctorOrder.rows;
  },

  async createOrder({clinicId, doctorId, date, time, userId, description}) {
    return await sails.sendNativeQuery(createNewOrderQuery, [
      clinicId,
      doctorId,
      date,
      time,
      userId,
      description,
    ]);
  },

  async cancelOrder({clinicId, doctorId, date, time, userId}) {
    return await sails.sendNativeQuery(cancelOrderQuery, [
      clinicId,
      doctorId,
      date,
      time,
      userId,
    ]);
  },

  async changeOrderStatus({status, clinicId, doctorId, date, time, userId}) {
    return await sails.sendNativeQuery(changeOrderStatusQuery, [
      status,
      clinicId,
      doctorId,
      date,
      time,
      userId,
    ]);
  },

  async getUserOrders(userId) {
    const orders = await sails.sendNativeQuery(userOrdersQuery, [
      userId,
    ]);

    return orders.rows;
  },
};
