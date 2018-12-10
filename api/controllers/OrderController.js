/**
 * OrderController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var DoctorService = require('../services/DoctorService');

module.exports = {
  async makeOrder(req, res) {
    const result = sails.helpers.parametersCheck(req, ['mc_id', 'user_id', 'doctor_id', 'date', 'time', 'description']);
    if (result.error) {
      return res.badRequest(result.error);
    }

    const {body} = req;

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

    const doctorOrder = await DoctorService.getDoctorTime(body);

    if (!doctorOrder.length) {
      return res.notFound('Incorrect time.');
    }

    let order = doctorOrder[0];
    if (order.patient_id !== null) {
      return res.notFound('This time is already busy.');
    }

    await DoctorService.createOrder(body);
    return res.ok();
  },

  async cancelOrder(req, res) {
    const result = sails.helpers.parametersCheck(req, ['mc_id', 'user_id', 'doctor_id', 'date', 'time']);
    if (result.error) {
      return res.badRequest(result.error);
    }

    const {body} = req;

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

    const cancelQueryResult = await DoctorService.cancelOrder(body);

    if (cancelQueryResult.rowCount === 0) {
      return res.notFound('This time is not owned by you');
    }

    return res.ok();
  },

  async changeStatusOrder(req, res) {
    const result = sails.helpers.parametersCheck(req, ['mc_id', 'user_id', 'doctor_id', 'date', 'time', 'status']);
    if (result.error) {
      return res.badRequest(result.error);
    }

    const {body} = req;
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

    const updateQueryResult = await DoctorService.changeOrderStatus(body);

    if (updateQueryResult.rowCount === 0) {
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

    const orders = await DoctorService.getUserOrders(userId);
    return res.json(orders);
  },
};
