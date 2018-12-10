const DOCTORS_SELECT_QUERY = `
  SELECT doctors.*, specialities.name AS speciality,
  users.last_name, users.first_name, users.middle_name
  FROM doctors
  JOIN specialities ON specialities.speciality_id = doctors.speciality_id
  JOIN users ON users.user_id = doctors.doctor_id
  ORDER BY doctors.doctor_id`;

const DOCTOR_CLINIC_DEPENDENCY_QUERY = 'SELECT * FROM doctors_centres ORDER BY doctor_id';

const GET_DOCTOR_TIMESHEET_QUERY = 'SELECT mc_id, date, start FROM timesheet WHERE doctor_id = $1 AND mc_id = $2 AND date >= current_date';

module.exports = {
    async getAllDoctors() {
        const doctorSelectResult = await sails.sendNativeQuery(DOCTORS_SELECT_QUERY);
        const doctorsToClinics = await sails.sendNativeQuery(DOCTOR_CLINIC_DEPENDENCY_QUERY);
        const doctorToClinicsRows = doctorsToClinics.rows;
        let i = 0;
        doctorSelectResult.rows.forEach(function(doctor) {
            /* Список клиник для каждого доктора */
            let clinics = new Array();
            while(i < doctorToClinicsRows.length && doctorToClinicsRows[i].doctor_id == doctor.doctor_id) {
                clinics.push(doctorToClinicsRows[i].centre_id);
                i++;
            }
            doctor.clinics = clinics;
        });
        return doctorSelectResult.rows;
    },

    async getDoctorsByClinicID(clinicID) {
        const WHERE_CLAUSE = `WHERE doctors.doctor_id IN (SELECT doctor_id FROM doctors_centres WHERE centre_id = $1)`;

        const doctorList = await sails.sendNativeQuery(
            `${DOCTORS_SELECT_QUERY} ${WHERE_CLAUSE}`,
            [clinicID],
        );
        return doctorList.rows;
    },

    async getDoctorTimesheet(doctorID, clinicID) {
        const WHERE_CLAUSE = `WHERE doctors.doctor_id = $1 LIMIT 1`;

        const doctorInfo = await sails.sendNativeQuery(
            `${DOCTORS_SELECT_QUERY} ${WHERE_CLAUSE}`,
            [doctorID]
        );

        if (doctorInfo.rowCount === 0) {
            return null;
        }

        const timesheet = await sails.sendNativeQuery(GET_DOCTOR_TIMESHEET_QUERY, [doctorID, clinicID]);
        doctorInfo.rows[0].timesheet = timesheet.rows;
        return doctorInfo.rows[0];
    }
};

