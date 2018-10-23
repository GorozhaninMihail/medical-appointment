/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let QUERY = `
      SELECT ${Doctor.tableName}.*, ${Speciality.tableName}.${Speciality.schema.name.columnName} AS speciality,
      ${User.tableName}.${User.schema.last_name.columnName}, ${User.tableName}.${User.schema.first_name.columnName}, ${User.tableName}.${User.schema.middle_name.columnName}
      FROM ${Doctor.tableName}
      JOIN ${Speciality.tableName} ON ${Speciality.tableName}.${Speciality.schema.id.columnName} = ${Doctor.tableName}.${Doctor.schema.speciality.columnName}
      JOIN ${User.tableName} ON ${User.tableName}.${User.schema.id.columnName} = ${Doctor.tableName}.${Doctor.schema.id.columnName}`;

module.exports = {
  all_doctors: async function(req, res)
  {
    let doctors = await sails.sendNativeQuery(QUERY);
    return res.json(doctors.rows);
  },

  find_doctors: async function(req, res) {
    let mc = parseInt(req.param('mc'));
    if(isNaN(mc)) {
      return res.badRequest('Incorrect medical centre ID');
    }
    else {
      let whereClause = `WHERE ${Doctor.tableName}.${Doctor.schema.id.columnName} IN (SELECT doctor_id FROM doctors_centres WHERE centre_id = $1)`;
      let doctors = await sails.sendNativeQuery(QUERY + " " + whereClause, [mc]);
      return res.json(doctors.rows);
    }
  },

  doctor_info: async function(req, res) {
    let TIMESHEET_QUERY = "SELECT mc_id, date, start FROM timesheet WHERE doctor_id = $1 AND mc_id = $2 AND date >= current_date";
    let id = parseInt(req.param('doctor_id'));
    let mc = parseInt(req.param('mc', 0));
    if(isNaN(id)) {
      return res.badRequest('Incorrect doctor ID');
    }
    else {
      let whereClause = `WHERE ${Doctor.tableName}.${Doctor.schema.id.columnName} = $1 LIMIT 1`;
      let doctors = await sails.sendNativeQuery(QUERY + " " + whereClause, [id]);
      if(doctors.rowCount === 0) return res.notFound("Doctor with ID " + id + " is not found");

      let timesheet = await sails.sendNativeQuery(TIMESHEET_QUERY, [id, mc]);
      doctors.rows[0].timesheet = timesheet.rows;
      return res.json(doctors.rows[0]);
    }
  }
};

