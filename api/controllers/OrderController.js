/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async makeOrder(req, res) {
    const {body} = req;

    if (!body.mc_id) {
      return res.badRequest('Param mc_id is undefined');
    }

    if (!body.user_id) {
      return res.badRequest('Param user_id is undefined');
    }

    if (!body.doctor_id) {
      return res.badRequest('Param doctor_id is undefined');
    }

    if (!body.date) {
      return res.badRequest('Param date is undefined');
    }

    if (!body.time) {
      return res.badRequest('Param time is undefined');
    }

    if (!body.description) {
      return res.badRequest('Param description is undefined');
    }

    const mc = await MedicalCentre.find({id: body.mc_id});
    const user = await User.find({id: body.user_id});
    const doctor = await Doctor.find({id: body.doctor_id});

    if (!mc.length) {
      return res.notFound(`Medical Centre with ID ${body.mc_id} is not found.`);
    }

    if (!user.length) {
      return res.notFound(`User with ID ${body.user_id} is not found.`);
    }

    if (!doctor.length) {
      return res.notFound(`Doctor with ID ${body.doctor_id} is not found.`);
    }

    const query = `
      SELECT timesheet.*, orders.patient_id FROM timesheet
      LEFT JOIN orders ON (orders.mc_id, orders.doctor_id, orders.date, orders.time) = (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start)
      WHERE (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start) = ($1, $2, $3, $4)`;

    const doctorOrder = await sails.sendNativeQuery(query, [
      body.mc_id,
      body.doctor_id,
      body.date,
      body.time,
    ]);

    if (!doctorOrder.rows.length) {
      return res.notFound('Incorrect time.');
    }

    let order = doctorOrder.rows[0];

    if (order.patient_id !== null) {
      return res.notFound('This time is already busy.');
    }

    await sails.sendNativeQuery(
      'INSERT INTO orders (mc_id, doctor_id, date, time, patient_id, description, status) VALUES ($1, $2, $3, $4, $5, $6, 0)',
      [
        body.mc_id,
        body.doctor_id,
        body.date,
        body.time,
        body.user_id,
        body.description,
      ],
    );

    return res.ok();
  },

  async cancelOrder(req, res) {
    const {body} = req;

    if (!body.mc_id) {
      return res.badRequest('Param mc_id is undefined');
    }

    if (!body.user_id) {
      return res.badRequest('Param user_id is undefined');
    }

    if (!body.doctor_id) {
      return res.badRequest('Param doctor_id is undefined');
    }

    if (!body.date) {
      return res.badRequest('Param date is undefined');
    }

    if (!body.time) {
      return res.badRequest('Param time is undefined');
    }

    const mc = await MedicalCentre.find({id: body.mc_id});
    const user = await User.find({id: body.user_id});
    const doctor = await Doctor.find({id: body.doctor_id});

    if (mc.length === 0) {
      return res.notFound(`Medical Centre with ID ${body.mc_id} is not found.`);
    }

    if (!user.length) {
      return res.notFound(`User with ID ${body.user_id} is not found.`);
    }

    if (!doctor.length) {
      return res.notFound('Doctor was not found');
    }

    const query = 'DELETE FROM orders WHERE (orders.mc_id, orders.doctor_id, orders.date, orders.time, orders.patient_id) = ($1, $2, $3, $4, $5)';

    const deleteQuery = await sails.sendNativeQuery(query, [
      body.mc_id,
      body.doctor_id,
      body.date,
      body.time,
      body.user_id,
    ]);

    if (deleteQuery.rowCount === 0) {
      return res.notFound('This time is not owned by you');
    }

    return res.ok();
  },

  async changeStatusOrder(req, res) {
    const {body} = req;

    if (!body.mc_id) {
      return res.badRequest('Param mc_id is undefined');
    }

    if (!body.user_id) {
      return res.badRequest('Param user_id is undefined');
    }

    if (!body.doctor_id) {
      return res.badRequest('Param doctor_id is undefined');
    }

    if (!body.date) {
      return res.badRequest('Param date is undefined');
    }

    if (!body.time) {
      return res.badRequest('Param time is undefined');
    }

    if (!body.status) {
      return res.badRequest('Param status is undefined');
    }

    const mc = await MedicalCentre.find({id: body.mc_id});
    const user = await User.find({id: body.user_id});
    const doctor = await Doctor.find({id: body.doctor_id});

    if (mc.length === 0) {
      return res.notFound(`Medical Centre with ID ${body.mc_id} is not found.`);
    }

    if (user.length === 0) {
      return res.notFound(`User with ID ${body.user_id} is not found.`);
    }

    if (doctor.length === 0) {
      return res.notFound(`Doctor with ID ${body.doctor_id} is not found.`);
    }

    const query = 'UPDATE orders SET status = $1 WHERE (mc_id, doctor_id, date, time, patient_id) = ($2, $3, $4, $5, $6)';

    const updateQuery = await sails.sendNativeQuery(query, [
      body.status,
      body.mc_id,
      body.doctor_id,
      body.date,
      body.time,
      body.user_id,
    ]);

    if (updateQuery.rowCount === 0) {
      return res.notFound('This time is not owned by you');
    }

    return res.ok();
  },

  async orderList(req, res) {
    const userId = req.param('user');

    if (!userId) {
      return res.badRequest('Param user is undefined');
    }

    const user = await User.find({id: userId});

    if (!user.length) {
      return res.notFound(`User with ID ${userId} is not found.`);
    }

    const query = `SELECT orders.date, orders.time, orders.status, mc.name AS mc_name, mc.address, specialities.name, users.last_name, users.first_name, users.middle_name
      FROM orders
      LEFT JOIN medical_centres mc ON mc.id = orders.mc_id
      LEFT JOIN doctors ON doctors.doctor_id = orders.doctor_id
      JOIN users ON users.user_id = doctors.doctor_id
      LEFT JOIN specialities ON specialities.speciality_id = doctors.speciality_id
      WHERE orders.patient_id = $1
      ORDER BY orders.date DESC, orders.time DESC`;

    const orders = await sails.sendNativeQuery(query, [userId]);

    return res.json(orders.rows);
  },
};
