/**
 * MedicalCentreController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  async allClinics(req, res) {
    const centreList = await MedicalCentre.find({sort: 'id'});
    const doctors_clinics = await sails.sendNativeQuery('SELECT * FROM doctors_centres ORDER BY centre_id');
    let i = 0;
    centreList.forEach(function(clinic) {
      /* Список врачей, работающих в учреждении */
      let doctors = new Array();
      while(i < doctors_clinics.rows.length && doctors_clinics.rows[i].centre_id == clinic.id) {
        doctors.push(doctors_clinics.rows[i].doctor_id);
        i++;
      }
      clinic.doctors = doctors;
    });
    return res.json(centreList);
  },

  async addNewClinic(req, res) {
    const {body} = req.body;

    const result = sails.helpers.parametersCheck(req, ['name', 'address']);

    if (result.error) {
      return res.badRequest('Incorrect params');
    }

    const CREATE_CLINIC_QUERY = 'INSERT INTO medical_centres (name, description, address) VALUES ($1, $2, $3)';

    await sails.sendNativeQuery(CREATE_CLINIC_QUERY, [body.name, body.description, body.address]);

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

    const query = 'UPDATE medical_centres SET (name, description, address) = ($1, $2, $3) WHERE id = $4';

    await sails.sendNativeQuery(query, [body.name, body.description, body.address, clinicID]);

    return res.ok();
  },
};
