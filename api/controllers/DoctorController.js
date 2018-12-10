/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var DoctorService = require('../services/DoctorService');

module.exports = {
  async allDoctors(req, res) {
    const doctorList = await DoctorService.getAllDoctors(req);
    return res.json(doctorList);
  },

  async findDoctors(req, res) {
    const clinicID = Number(req.param('mc'));
    if (Number.isNaN(mc)) {
      return res.badRequest('Incorrect clinic ID');
    }
    const doctorList = await DoctorService.getDoctorsByClinicID(clinicID);
    return res.json(doctorList);
  },

  async doctorInfo(req, res) {
    const doctorID = Number(req.param('doctor_id'));
    const clinicID = Number(req.param('mc', 0));

    if (Number.isNaN(doctorID)) {
      return res.badRequest('Incorrect doctor ID');
    }

    const doctorInfo = await DoctorService.getDoctorTimesheet(doctorID, clinicID);
    if(doctorInfo === null)
      return res.notFound(`Doctor with ID ${doctorID} was not found`)
    return res.json(doctorInfo);
  }
};
