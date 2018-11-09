/**
 * MedicalCentreController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  all_clinics: async function(req, res) {
    let centreList = await MedicalCentre.find();
    return res.json(centreList);
  },

  add_new_clinic: async function(req, res) {
    let body = req.body;
    let result = sails.helpers.parametersCheck(req, ['name', 'address']);
    if(result.error) return res.badRequest(result.error);

    let CREATE_CLINIC_QUERY = `
      INSERT INTO medical_centres (name, description, address) VALUES ($1, $2, $3)
    `;
    await sails.sendNativeQuery(CREATE_CLINIC_QUERY, [body.name, body.description, body.address]);
    return res.sendStatus(201);
  }
};

