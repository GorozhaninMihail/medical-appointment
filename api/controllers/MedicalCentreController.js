/**
 * MedicalCentreController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
var ClinicService = require('../services/ClinicService');

module.exports = {
  async allClinics(req, res) {
    const clinicList = await ClinicService.getAllClinics();
    return res.json(clinicList);
  },

  async addNewClinic(req, res) {
    const {body} = req.body;

    const result = sails.helpers.parametersCheck(req, ['name', 'address']);
    if (result.error) {
      return res.badRequest(result.error);
    }

    await ClinicService.createNewClinic(body);
    return res.sendStatus(201);
  },

  async getClinicById(req, res) {
    const clinicID = Number(req.param('id'));

    const clinic = await MedicalCentre.findOne({id: clinicID});

    if (!clinic) {
      return res.notFound(`Clinic with ID ${clinicID} is not found.`);
    }

    return res.json(clinic);
  },

  async updateClinicInfo(req, res) {
    const clinicID = Number(req.param('id'));

    const clinic = await MedicalCentre.findOne({id: clinicID});
    if (!clinic) {
      return res.notFound(`Clinic with ID ${clinicID} is not found.`);
    }

    const {body} = req;

    const result = sails.helpers.parametersCheck(req, ['name', 'address']);
    if (result.error) {
      return res.badRequest(result.error);
    }

    await ClinicService.updateClinic(clinicID, body);
    return res.ok();
  }
};
