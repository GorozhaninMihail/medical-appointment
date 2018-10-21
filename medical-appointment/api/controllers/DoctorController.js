/**
 * DoctorController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let QUERY = `
      SELECT ${Doctor.tableName}.*, 
      ${User.tableName}.${User.schema.last_name.columnName}, ${User.tableName}.${User.schema.first_name.columnName}, ${User.tableName}.${User.schema.middle_name.columnName}
      FROM ${Doctor.tableName}
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
    
  }
};

