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

  'GET /clinics': 'MedicalCentreController.allClinics',
  'GET /clinics/:id': 'MedicalCentreController.getClinicById',
  'POST /clinics': 'MedicalCentreController.addNewClinic',
  'PUT /clinics/:id': 'MedicalCentreController.updateClinicInfo',

  'GET /users/all': 'UserController.all_users',
  //'GET /users/:name': 'UserController.find_users_by_name',
  'GET /doctors/all': 'DoctorController.allDoctors',
  'GET /doctors/:doctor_id': 'DoctorController.doctorInfo',
  'GET /doctors/': 'DoctorController.findDoctors',


  'PUT /order': 'OrderController.makeOrder',
  'DELETE /order': 'OrderController.cancelOrder',
  'POST /order': 'OrderController.changeStatusOrder',
  'GET /orders': 'OrderController.orderList',

  'POST /online': 'OnlineController.addQuestion',
  'GET /online': 'OnlineController.getQuestions',
  'GET /online/:id': 'OnlineController.getQuestionInfo',
  'PUT /online/:id': 'OnlineController.addAnswer',
  'DELETE /online/:id': 'OnlineController.closeQuestion'
};
