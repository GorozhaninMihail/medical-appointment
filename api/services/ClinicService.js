/* global sails Clinic */

const doctorClinicsDependencyQuery = `
SELECT *
FROM doctors_centres
ORDER BY centre_id`;

const createClinicQuery = `
INSERT INTO medical_centres (name, description, address)
VALUES ($1, $2, $3)`;

const updateClinicQuery = `
UPDATE medical_centres
SET (name, description, address) = ($1, $2, $3)
WHERE id = $4`;

module.exports = {
  async getAllClinics() {
    const centreList = await Clinic.find({sort: 'id'});

    const doctorsClinics = await sails.sendNativeQuery(
      doctorClinicsDependencyQuery,
    );

    let i = 0;

    centreList.forEach(clinic => {
      /* Список врачей, работающих в учреждении */
      let doctors = [];

      while (
        i < doctorsClinics.rows.length
          && doctorsClinics.rows[i].centre_id === clinic.id
      ) {
        doctors.push(doctorsClinics.rows[i].doctor_id);
        i++;
      }

      clinic.doctors = doctors;
    });

    return centreList;
  },

  async createNewClinic({name, description, address}) {
    return await sails.sendNativeQuery(createClinicQuery, [
      name,
      description,
      address,
    ]);
  },

  async updateClinic({id, name, description, address}) {
    return await sails.sendNativeQuery(updateClinicQuery, [
      name,
      description,
      address,
      id,
    ]);
  },
};
