const doctorsSelectQuery = (whereClause = '') => `
SELECT doctors.*, specialities.name AS speciality,
users.last_name, users.first_name, users.middle_name
FROM doctors
JOIN specialities ON specialities.speciality_id = doctors.speciality_id
JOIN users ON users.user_id = doctors.doctor_id
${whereClause}
ORDER BY doctors.doctor_id`;

const doctorsClinicsQuery = `SELECT *
FROM doctors_centres
ORDER BY doctor_id`;

const doctorTimesheetQuery = `SELECT mc_id, date, start
FROM timesheet
WHERE doctor_id = $1 AND date >= current_date`;

const SELECT_DOCTOR_TIMESHEET_QUERY = `SELECT timesheet.*, orders.patient_id
FROM timesheet
LEFT JOIN orders ON (orders.mc_id, orders.doctor_id, orders.date, orders.time) = (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start)
WHERE (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start) = ($1, $2, $3, $4)`;

/* global sails */

module.exports = {
  async getAllDoctors() {
    const doctorSelectResult = await sails.sendNativeQuery(
      doctorsSelectQuery(),
    );

    const doctorsToClinics = await sails.sendNativeQuery(
      doctorsClinicsQuery,
    );

    const doctorToClinicsRows = doctorsToClinics.rows;

    let i = 0;

    doctorSelectResult.rows.forEach(doctor => {
      // Список клиник для каждого доктора
      let clinics = [];
      while (
        i < doctorToClinicsRows.length
          && doctorToClinicsRows[i].doctor_id === doctor.doctor_id
      ) {
        clinics.push(doctorToClinicsRows[i].centre_id);
        i++;
      }

      doctor.clinics = clinics;
    });

    return doctorSelectResult.rows;
  },

  async getDoctorsByClinicID(clinicId) {
    const whereClause = 'WHERE doctors.doctor_id IN (SELECT doctor_id FROM doctors_centres WHERE centre_id = $1)';

    const doctorList = await sails.sendNativeQuery(
      doctorsSelectQuery(whereClause),
      [clinicId],
    );

    return doctorList.rows;
  },

  async getDoctorInfo(doctorId) {
    const whereClause = 'WHERE doctors.doctor_id = $1';

    const doctor = await sails.sendNativeQuery(
      doctorsSelectQuery(whereClause),
      [doctorId],
    );

    if (!doctor.rowCount) {
      return null;
    }

    const timesheet = await sails.sendNativeQuery(doctorTimesheetQuery, [
      doctorId,
    ]);

    doctor.rows[0].timesheet = timesheet.rows;

    return doctor.rows[0];
  },

  async getDoctorTime({clinicId, doctorId, date, time}) {
    const doctorOrder = await sails.sendNativeQuery(
      SELECT_DOCTOR_TIMESHEET_QUERY,
      [clinicId, doctorId, date, time],
    );

    return doctorOrder.rows;
  },
};
