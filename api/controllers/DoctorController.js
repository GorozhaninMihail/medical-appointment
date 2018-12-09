/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const query = `
  SELECT doctors.*, specialities.name AS speciality,
  users.last_name, users.first_name, users.middle_name
  FROM doctors
  JOIN specialities ON specialities.speciality_id = doctors.speciality_id
  JOIN users ON users.user_id = doctors.doctor_id
  ORDER BY doctors.doctor_id`;

module.exports = {
  async allDoctors(req, res) {
    const doctors = await sails.sendNativeQuery(query);
    const doctors_clinics = await sails.sendNativeQuery('SELECT * FROM doctors_centres ORDER BY doctor_id');
    let i = 0;
    doctors.rows.forEach(function(doctor) {
      /* Список клиник для каждого доктора */
      let clinics = new Array();
      while(i < doctors_clinics.rows.length && doctors_clinics.rows[i].doctor_id == doctor.doctor_id) {
        clinics.push(doctors_clinics.rows[i].centre_id);
        i++;
      }
      doctor.clinics = clinics;
    });
    return res.json(doctors.rows);
  },

  async findDoctors(req, res) {
    const mc = Number(req.param('mc'));

    if (Number.isNaN(mc)) {
      return res.badRequest('Incorrect doctor ID');
    }

    const whereClause = `WHERE doctors.doctor_id IN (SELECT doctor_id FROM doctors_centres WHERE centre_id = $1)`;

    const doctors = await sails.sendNativeQuery(
      `${query} ${whereClause}`,
      [mc],
    );

    return res.json(doctors.rows);
  },

  async doctorInfo(req, res) {
    const timesheetQuery = 'SELECT mc_id, date, start FROM timesheet WHERE doctor_id = $1 AND mc_id = $2 AND date >= current_date';

    const id = Number(req.param('doctor_id'));
    const mc = Number(req.param('mc', 0));

    if (Number.isNaN(id)) {
      return res.badRequest('Incorrect doctor ID');
    }

    const whereClause = `WHERE doctors.doctor_id = $1 LIMIT 1`;

    const doctors = await sails.sendNativeQuery(
      `${query} ${whereClause}`,
      [id]
    );

    if (doctors.rowCount === 0) {
      return res.notFound(`Doctor with ID ${id} was not found`);
    }

    const timesheet = await sails.sendNativeQuery(timesheetQuery, [id, mc]);

    doctors.rows[0].timesheet = timesheet.rows;

    return res.json(doctors.rows[0]);
  },
};
