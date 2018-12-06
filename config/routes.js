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
  // 'POST /api/v1/login': '',
  // 'POST /api/v1/signup': '',
  // 'POST /api/v1/logout': '',

  'GET /api/v1/clinics': 'MedicalCentreController.allClinics',
  'GET /api/v1/clinics/:id': 'MedicalCentreController.getClinicById',
  'POST /api/v1/clinics': 'MedicalCentreController.addNewClinic',
  'PUT /api/v1/clinics/:id': 'MedicalCentreController.updateClinicInfo',

  'GET /api/v1/users/all': 'UserController.allUsers',
  //'GET /users/:name': 'UserController.find_users_by_name',
  'GET /api/v1/doctors/all': 'DoctorController.allDoctors',
  'GET /api/v1/doctors/:doctor_id': 'DoctorController.doctorInfo',
  'GET /api/v1/doctors/': 'DoctorController.findDoctors',

  'PUT /api/v1/order': 'OrderController.makeOrder',
  'DELETE /api/v1/order': 'OrderController.cancelOrder',
  'POST /api/v1/order': 'OrderController.changeStatusOrder',
  'GET /api/v1/orders': 'OrderController.orderList',

  'POST /api/v1/online': 'OnlineController.addQuestion',
  'GET /api/v1/online': 'OnlineController.getQuestions',
  'GET /api/v1/online/:id': 'OnlineController.getQuestionInfo',
  'PUT /api/v1/online/:id': 'OnlineController.addAnswer',
  'DELETE /api/v1/online/:id': 'OnlineController.closeQuestion'
};
