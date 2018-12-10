const DOCTOR_CLINIC_DEPENDENCY_QUERY = 'SELECT * FROM doctors_centres ORDER BY centre_id';
const CREATE_CLINIC_QUERY = 'INSERT INTO medical_centres (name, description, address) VALUES ($1, $2, $3)';
const UPDATE_CLINIC_QUERY = 'UPDATE medical_centres SET (name, description, address) = ($1, $2, $3) WHERE id = $4';

module.exports = {
    async getAllClinics() {
        const centreList = await MedicalCentre.find({sort: 'id'});
        const doctors_clinics = await sails.sendNativeQuery(DOCTOR_CLINIC_DEPENDENCY_QUERY);
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
        return centreList;
    },

    async createNewClinic(params) {
        await sails.sendNativeQuery(CREATE_CLINIC_QUERY, [params.name, params.description, params.address]);
    },

    async updateClinic(clinicID, params) {
        await sails.sendNativeQuery(UPDATE_CLINIC_QUERY, [params.name, params.description, params.address, clinicID]);
    }

};
