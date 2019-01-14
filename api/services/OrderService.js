
const findOrderQuery = `SELECT *
FROM orders
WHERE (orders.mc_id, orders.doctor_id, orders.date, orders.time, orders.patient_id) = ($1, $2, $3, $4, $5)`;

const createNewOrderQuery = `INSERT INTO orders (mc_id, doctor_id, date, time, patient_id, description, status)
VALUES ($1, $2, $3, $4, $5, $6, 0)`;

const cancelOrderQuery = `DELETE FROM orders
WHERE (orders.mc_id, orders.doctor_id, orders.date, orders.time, orders.patient_id) = ($1, $2, $3, $4, $5)`;

const changeOrderStatusQuery = `UPDATE orders SET status = $1
WHERE (mc_id, doctor_id, date, time, patient_id) = ($2, $3, $4, $5, $6)`;

const ordersQuery = (by = 'patient') => `SELECT orders.patient_id AS user_id, orders.mc_id, orders.doctor_id, orders.date, orders.time, orders.status, mc.name AS mc_name, mc.address, specialities.name, users.last_name, users.first_name, users.middle_name, users.user_id AS doctor_id
FROM orders
LEFT JOIN medical_centres mc ON mc.id = orders.mc_id
LEFT JOIN doctors ON doctors.doctor_id = orders.doctor_id
JOIN users ON users.user_id = doctors.doctor_id
LEFT JOIN specialities ON specialities.speciality_id = doctors.speciality_id
WHERE orders.${by}_id = $1
ORDER BY orders.date DESC, orders.time DESC`;

const selectDuplicateTimesheetQuery = `SELECT doctor_id, date, start
FROM timesheet
GROUP BY doctor_id, date, start
HAVING count(*) > 1`;

const selectWrongOrdersQuery = `SELECT mc_id, doctor_id, date
FROM orders
WHERE (mc_id, doctor_id, date, time)
NOT IN (SELECT mc_id, doctor_id, date, start FROM timesheet)`;

/* global sails */
const _ = require('lodash');

module.exports = {
  async findOrder({clinicId, doctorId, date, time, userId}) {
    return (await sails.sendNativeQuery(findOrderQuery, [
      clinicId,
      doctorId,
      date,
      time,
      userId,
    ])).rows[0];
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

  async getUserOrders(userId, doctorId) {
    let orders = (await sails.sendNativeQuery(ordersQuery(), [userId]))
      .rows;

    if (doctorId) {
      const doctorOrders = (await sails.sendNativeQuery(
        ordersQuery('doctor'),
        [doctorId],
      )).rows;

      orders.push(...doctorOrders);

      orders = _.uniqWith(orders, _.isEqual);
    }

    return orders;
  },

  async getDuplicateTimesheetRows() {
    const timesheet = await sails.sendNativeQuery(selectDuplicateTimesheetQuery);
    return timesheet.rows;
  },

  async getWrongOrderRows() {
    const orders = await sails.sendNativeQuery(selectWrongOrdersQuery);
    return orders.rows;
  },
};
