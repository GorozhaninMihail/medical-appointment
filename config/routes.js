/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  '/': {
    view: 'pages/homepage'
  },

  'GET /clinics': 'MedicalCentreController.all_clinics',
  'POST /clinics': 'MedicalCentreController.add_new_clinic',

  'GET /users/all': 'UserController.all_users',
  //'GET /users/:name': 'UserController.find_users_by_name',
  'GET /doctors/all': 'DoctorController.all_doctors',
  'GET /doctors/:doctor_id': 'DoctorController.doctor_info',
  'GET /doctors/': 'DoctorController.find_doctors',


  'PUT /order': 'OrderController.make_order',
  'DELETE /order': 'OrderController.cancel_order',
  'POST /order': 'OrderController.change_status_order',
  'GET /orders': 'OrderController.order_list',

  'PUT /online': 'OnlineController.add_question'
};
