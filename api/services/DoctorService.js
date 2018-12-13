const DOCTORS_SELECT_QUERY = `
  SELECT doctors.*, specialities.name AS speciality,
  users.last_name, users.first_name, users.middle_name
  FROM doctors
  JOIN specialities ON specialities.speciality_id = doctors.speciality_id
  JOIN users ON users.user_id = doctors.doctor_id
  ORDER BY doctors.doctor_id`;

const DOCTOR_CLINIC_DEPENDENCY_QUERY = 'SELECT * FROM doctors_centres ORDER BY doctor_id';

const GET_DOCTOR_TIMESHEET_QUERY = 'SELECT mc_id, date, start FROM timesheet WHERE doctor_id = $1 AND mc_id = $2 AND date >= current_date';

const SELECT_DOCTOR_TIMESHEET_QUERY = `SELECT timesheet.*, orders.patient_id FROM timesheet
    LEFT JOIN orders ON (orders.mc_id, orders.doctor_id, orders.date, orders.time) = (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start)
    WHERE (timesheet.mc_id, timesheet.doctor_id, timesheet.date, timesheet.start) = ($1, $2, $3, $4)`;

const CREATE_NEW_ORDER_QUERY = `INSERT INTO orders (mc_id, doctor_id, date, time, patient_id, description, status) VALUES ($1, $2, $3, $4, $5, $6, 0)`;

const CANCEL_ORDER_QUERY = `DELETE FROM orders WHERE (orders.mc_id, orders.doctor_id, orders.date, orders.time, orders.patient_id) = ($1, $2, $3, $4, $5)`;

const CHANGE_ORDER_STATUS_QUERY = `UPDATE orders SET status = $1 WHERE (mc_id, doctor_id, date, time, patient_id) = ($2, $3, $4, $5, $6)`;

const SELECT_USER_ORDERS_QUERY = `SELECT orders.date, orders.time, orders.status, mc.name AS mc_name, mc.address, specialities.name, users.last_name, users.first_name, users.middle_name
    FROM orders
    LEFT JOIN medical_centres mc ON mc.id = orders.mc_id
    LEFT JOIN doctors ON doctors.doctor_id = orders.doctor_id
    JOIN users ON users.user_id = doctors.doctor_id
    LEFT JOIN specialities ON specialities.speciality_id = doctors.speciality_id
    WHERE orders.patient_id = $1
    ORDER BY orders.date DESC, orders.time DESC`;

const SELECT_DUPLICATE_TIMESHEET_QUERY = `SELECT doctor_id, date, start FROM timesheet GROUP BY doctor_id, date, start HAVING count(*) > 1`;
const SELECT_WRONG_ORDERS_QUERY = `SELECT mc_id, doctor_id, date FROM orders WHERE (mc_id, doctor_id, date, time) NOT IN (SELECT mc_id, doctor_id, date, start FROM timesheet)`;

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
    },

    async getDoctorTime(params) {
        const doctorOrder = await sails.sendNativeQuery(SELECT_DOCTOR_TIMESHEET_QUERY, [
            params.mc_id,
            params.doctor_id,
            params.date,
            params.time,
          ]);
        return doctorOrder.rows;
    },

    async createOrder(params) {
        await sails.sendNativeQuery(
            CREATE_NEW_ORDER_QUERY,
            [
                params.mc_id,
                params.doctor_id,
                params.date,
                params.time,
                params.user_id,
                params.description
            ],
          );
    },

    async cancelOrder(params) {
        const result = await sails.sendNativeQuery(CANCEL_ORDER_QUERY, [
            params.mc_id,
            params.doctor_id,
            params.date,
            params.time,
            params.user_id,
          ]);
        return result;
    },

    async changeOrderStatus(params) {
        const result = await sails.sendNativeQuery(CHANGE_ORDER_STATUS_QUERY, [
            params.status,
            params.mc_id,
            params.doctor_id,
            params.date,
            params.time,
            params.user_id,
          ]);

        return result;
    },

    async getUserOrders(userID) {
        const orders = await sails.sendNativeQuery(SELECT_USER_ORDERS_QUERY, [userID]);
        return orders.rows;
    },

    async getDuplicateTimesheetRows() {
        const timesheet = await sails.sendNativeQuery(SELECT_DUPLICATE_TIMESHEET_QUERY);
        return timesheet.rows;
    },

    async getWrongOrderRows() {
        const orders = await sails.sendNativeQuery(SELECT_WRONG_ORDERS_QUERY);
        return orders.rows;
    }
   
};

