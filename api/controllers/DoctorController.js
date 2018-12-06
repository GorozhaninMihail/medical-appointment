/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const QUERY = `
      SELECT ${Doctor.tableName}.*, ${Speciality.tableName}.${Speciality.schema.name.columnName} AS speciality,
      ${User.tableName}.${User.schema.last_name.columnName}, ${User.tableName}.${User.schema.first_name.columnName}, ${User.tableName}.${User.schema.middle_name.columnName}
      FROM ${Doctor.tableName}
      JOIN ${Speciality.tableName} ON ${Speciality.tableName}.${Speciality.schema.id.columnName} = ${Doctor.tableName}.${Doctor.schema.speciality.columnName}
      JOIN ${User.tableName} ON ${User.tableName}.${User.schema.id.columnName} = ${Doctor.tableName}.${Doctor.schema.id.columnName}`;

module.exports = {
  async allDoctors(req, res) {
    const doctors = await sails.sendNativeQuery(QUERY);
    return res.json(doctors.rows);
  },

  async findDoctors(req, res) {
    const mc = parseInt(req.param('mc'));
    
    if (isNaN(mc)) {
      return res.badRequest('Incorrect medical centre ID');
    }
    
    const whereClause = `WHERE ${Doctor.tableName}.${Doctor.schema.id.columnName} IN (SELECT doctor_id FROM doctors_centres WHERE centre_id = $1)`;
    const doctors = await sails.sendNativeQuery(QUERY + " " + whereClause, [mc]);
    return res.json(doctors.rows);
  },
  
  async doctorInfo(req, res) {
    const TIMESHEET_QUERY = "SELECT mc_id, date, start FROM timesheet WHERE doctor_id = $1 AND mc_id = $2 AND date >= current_date";
    const id = parseInt(req.param('doctor_id'));
    const mc = parseInt(req.param('mc', 0));
    
    if (isNaN(id)) {
      return res.badRequest('Incorrect doctor ID');
    }
    
    const whereClause = `WHERE ${Doctor.tableName}.${Doctor.schema.id.columnName} = $1 LIMIT 1`;
    const doctors = await sails.sendNativeQuery(QUERY + " " + whereClause, [id]);
    if (doctors.rowCount === 0) {
      return res.notFound(`Doctor with ID ${id} was not found`);
    }

    const timesheet = await sails.sendNativeQuery(TIMESHEET_QUERY, [id, mc]);
    doctors.rows[0].timesheet = timesheet.rows;
    return res.json(doctors.rows[0]);
  }
};

