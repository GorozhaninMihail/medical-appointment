/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  make_order: async function(req, res) {
    let body = req.body;
    if(body.mc_id === undefined) return res.badRequest("Param 'mc_id' is undefined");
    if(body.user_id === undefined) return res.badRequest("Param 'user_id' is undefined");
    if(body.doctor_id === undefined) return res.badRequest("Param 'doctor_id' is undefined");
    if(body.date === undefined) return res.badRequest("Param 'date' is undefined");
    if(body.time === undefined) return res.badRequest("Param 'time' is undefined");
    if(body.description === undefined) return res.badRequest("Param 'description' is undefined");

    let mc = await MedicalCentre.find({id: body.mc_id});
    let user = await User.find({id: body.user_id});
    let doctor = await Doctor.find({id: body.doctor_id});
    if(mc.length === 0) return res.notFound('Medical Centre with ID ' + body.mc_id + ' is not found.');
    if(user.length === 0) return res.notFound('User with ID ' + body.user_id + ' is not found.');
    if(doctor.length === 0) return res.notFound('Doctor with ID ' + body.doctor_id + ' is not found.');

    let FIND_DOCTOR_ORDERS = `
      SELECT timesheet.*, orders.patient_id FROM timesheet 
      LEFT JOIN orders ON (orders.mc_id, orders.doctor_id, orders.date, orders.time) = (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start)
      WHERE (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start) = ($1, $2, $3, $4)`;
    let doctor_order = await sails.sendNativeQuery(FIND_DOCTOR_ORDERS, [body.mc_id, body.doctor_id, body.date, body.time]);
    if(doctor_order.rows.length === 0) return res.json('Incorrect time.');
    let order = doctor_order.rows[0];
    if(order.patient_id !== null) return res.status(404).json('This time is already busy.');

    let add_order_result = await sails.sendNativeQuery('INSERT INTO orders (mc_id, doctor_id, date, time, patient_id, description, status) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, 0)',
      [body.mc_id, body.doctor_id, body.date, body.time, body.user_id, body.description]);
    return res.ok();
  },

  cancel_order: async function(req, res) {

  }

};

