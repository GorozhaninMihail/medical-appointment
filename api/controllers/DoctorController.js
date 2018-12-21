/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const DoctorService = require('../services/DoctorService');

module.exports = {
  async getAllDoctors(req, res) {
    const doctorList = await DoctorService.getAllDoctors();

    return res.json(doctorList);
  },

  // async findDoctors(req, res) {
  //   const clinicID = Number(req.param('mc'));

  //   if (Number.isNaN(clinicID)) {
  //     return res.badRequest('Incorrect clinic ID');
  //   }

  //   const doctorList = await DoctorService.getDoctorsByClinicID(clinicID);

  //   return res.json(doctorList);
  // },

  async getDoctorInfo(req, res) {
    const doctorId = Number(req.params.id);

    if (!doctorId) {
      return res.notFound('Doctor not found.');
    }

    const doctorInfo = await DoctorService.getDoctorInfo(doctorId);

    if (!doctorInfo) {
      return res.notFound('Doctor not found.');
    }

    return res.json(doctorInfo);
  },
};
