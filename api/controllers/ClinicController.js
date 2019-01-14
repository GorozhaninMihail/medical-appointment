/**
 * ClinicController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
/* global sails Clinic */

const ClinicService = require('../services/ClinicService');

module.exports = {
  async getAllClinics(req, res) {
    const clinicList = await ClinicService.getAllClinics();

    return res.json(clinicList);
  },

  async getSpecificClinic(req, res) {
    const clinicId = Number(req.params.id);

    if (!clinicId) {
      return res.badRequest('No clinic ID specified.');
    }

    const clinic = await Clinic.findOne({id: clinicId});

    if (!clinic) {
      return res.notFound('Clinic was not found.');
    }

    return res.json(clinic);
  },

  async postAddNewClinic(req, res) {
    const {name, description, address} = req.body;

    const result = sails.helpers.parametersCheck(req, [
      'name',
      'description',
      'address',
    ]);

    if (result.error) {
      return res.badRequest(result.error);
    }

    await ClinicService.createNewClinic({name, description, address});

    return res.sendStatus(201);
  },

  async putUpdateClinicInfo(req, res) {
    const {id, name, description, address} = req.body;

    const clinicId = Number(id);

    if (!clinicId) {
      return res.badRequest('No clinic ID specified.');
    }

    const clinic = await Clinic.findOne({id: clinicId});

    if (!clinic) {
      return res.notFound('Clinic was not found.');
    }

    const result = sails.helpers.parametersCheck(req, [
      'name',
      'description',
      'address',
    ]);

    if (result.error) {
      return res.badRequest(result.error);
    }

    await ClinicService.updateClinic({id, name, description, address});

    return res.ok();
  },
};
