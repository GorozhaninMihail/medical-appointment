/**
 * MedicalCentreController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  allClinics: async function(req, res) {
    let centreList = await MedicalCentre.find();
    return res.json(centreList);
  },

  addNewClinic: async function(req, res) {
    let body = req.body;
    let result = sails.helpers.parametersCheck(req, ['name', 'address']);
    if(result.error) return res.badRequest(result.error);

    let CREATE_CLINIC_QUERY = `
      INSERT INTO medical_centres (name, description, address) VALUES ($1, $2, $3)
    `;
    await sails.sendNativeQuery(CREATE_CLINIC_QUERY, [body.name, body.description, body.address]);
    return res.sendStatus(201);
  },

  getClinicById: async function(req, res) {
    const clinicID = parseInt(req.param('id'));
    let clinic = await MedicalCentre.findOne({id: clinicID});
    if(!clinic) return res.notFound(`Clinic with ID ${clinicID} is not found.`);
    return res.json(clinic);
  },

  updateClinicInfo: async function(req, res) {
    const clinicID = parseInt(req.param('id'));
    let clinic = await MedicalCentre.findOne({id: clinicID});
    if(!clinic) return res.notFound(`Clinic with ID ${clinicID} is not found.`);

    let body = req.body;
    let result = sails.helpers.parametersCheck(req, ['name', 'address']);
    if(result.error) return res.badRequest(result.error);

    let UPDATE_CLINIC_QUERY = `
      UPDATE medical_centres SET (name, description, address) = ($1, $2, $3) WHERE id = $4
    `;
    await sails.sendNativeQuery(UPDATE_CLINIC_QUERY, [body.name, body.description, body.address, clinicID]);
    return res.ok();
  }
};

