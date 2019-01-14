/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global Clinic User Doctor */
const OrderService = require('../services/OrderService');
const DoctorService = require('../services/DoctorService');

module.exports = {
  async postMakeOrder(req, res) {
    const {clinicId, doctorId, date, time, description} = req.body;

    const userId = req.user.id;

    if (!clinicId || !doctorId || !date || !time || !description) {
      return res.badRequest('Недостаточно данных.');
    }

    const clinic = await Clinic.findOne({id: clinicId});
    const doctor = await Doctor.findOne({id: doctorId});

    if (!clinic || !doctor) {
      return res.badRequest('Неверный запрос.');
    }

    const doctorOrder = await DoctorService.getDoctorTime({
      clinicId,
      doctorId,
      date,
      time,
    });

    if (!doctorOrder.length) {
      return res.badRequest('Похоже, что выбранное вами время уже занято.');
    }

    let order = doctorOrder[0];

    if (order.patient_id !== null) {
      return res.badRequest('Похоже, что выбранное вами время уже занято.');
    }

    await OrderService.createOrder({
      clinicId,
      doctorId,
      date,
      time,
      userId,
      description,
    });

    return res.status(201).send();
  },

  async deleteCancelOrder(req, res) {
    const {clinicId, userId, doctorId, date, time} = req.body;

    if (!clinicId || !userId || !doctorId || !date || !time) {
      return res.badRequest('Недостаточно данных.');
    }

    const clinic = await Clinic.find({id: clinicId});
    const user = await User.find({id: userId});
    const doctor = await Doctor.find({id: doctorId});

    if (!clinic || !user || !doctor) {
      return res.badRequest('Невозможно отменить данную консультацию.');
    }

    const cancelQueryResult = await OrderService.cancelOrder({
      clinicId,
      doctorId,
      date,
      time,
      userId,
    });

    if (!cancelQueryResult.rowCount) {
      return res.badRequest('Невозможно отменить данную консультацию.');
    }

    return res.ok();
  },

  async putChangeStatusOrder(req, res) {
    const {clinicId, userId, doctorId, date, time} = req.body;

    if (!clinicId || !userId || !doctorId || !date || !time) {
      return res.badRequest('Недостаточно данных.');
    }

    const order = await OrderService.findOrder({
      clinicId,
      doctorId,
      date,
      time,
      userId,
    });

    if (!order) {
      return res.badRequest('Такая консультация не найдена.');
    }

    const status = +!order.status;

    const updateQueryResult = await OrderService.changeOrderStatus({
      status,
      clinicId,
      doctorId,
      date,
      time,
      userId,
    });

    if (!updateQueryResult.rowCount) {
      return res.badRequest('Невозможно изменить статус консультации на указанное вами.');
    }

    return res.send();
  },

  async getOrderList(req, res) {
    const {user} = req;
    const {id: userId, role} = user;

    let doctorId;

    if (role === 'doctor') {
      const doctorInfo = await Doctor.findOne({id: userId});
      doctorId = doctorInfo.id;
    }

    const orders = await OrderService.getUserOrders(userId, doctorId);

    return res.json(orders);
  },
};
