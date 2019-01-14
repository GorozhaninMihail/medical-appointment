/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global User Speciality Doctor */
const DoctorService = require('../services/DoctorService');

module.exports = {
  async getAllDoctors(req, res) {
    const doctorList = await DoctorService.getAllDoctors();
    return res.json(doctorList);
  },

  async getDoctorInfo(req, res) {
    const doctorId = Number(req.params.id);

    if (!doctorId) {
      return res.notFound('Такой врач не найден.');
    }

    const doctorInfo = await DoctorService.getDoctorInfo(doctorId);

    if (!doctorInfo) {
      return res.notFound('Такой врач не найден.');
    }

    return res.json(doctorInfo);
  },

  async postAddOrUpdateDoctor(req, res) {
    const {params, body} = req;

    const userId = +params.id;

    const {
      specialityId,
      information,
    } = body;

    const experience = +body.experience;
    const active = !!body.active;

    if (!userId) {
      return res.badRequest('Не указан ID пользователя.');
    }

    if (experience < 1
        || experience > 50) {
      return res.badRequest('Укажите стаж врача (от 1 года до 50 лет)');
    }

    if (information
        && (information.length < 10 || information.length > 300)) {
      return res.badRequest('Вы можете не указывать информацию о враче вообще, или же она должна быть длиной от 10 до 300 символов.');
    }

    const oldDoctorInfo = await Doctor.findOne({
      id: userId,
    });

    if (!oldDoctorInfo && !specialityId) {
      return res.badRequest('Укажите специальность врача.');
    }

    const user = await User.findOne({
      id: userId,
    });

    if (!user
      || !(user.role !== 'user'
      || user.role !== 'doctor')) {
      return res.badRequest('Такой пользователь не найден, или же он не может быть врачом.');
    }

    const speciality = await Speciality.findOne({
      id: specialityId,
    });

    if (!speciality) {
      return res.badRequest('Такой специальности не существует.');
    }

    const doctor = await DoctorService.addOrChangeDoctor({
      id: userId,
      specialityId,
      experience,
      information,
      active,
    });

    return res.json(doctor);
  },
};
