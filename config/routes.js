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
  'POST /api/v1/login': 'AuthController.postLogin',
  'POST /api/v1/signup': 'AuthController.postSignup',
  'GET /api/v1/currentuser': 'AuthController.getCurrentUser',
  // 'POST /api/v1/logout': 'AuthController.postLogout',

  'GET /api/v1/clinics': 'ClinicController.getAllClinics',
  'GET /api/v1/clinics/:id': 'ClinicController.getSpecificClinic',
  'POST /api/v1/clinics': 'ClinicController.postAddNewClinic',
  'PUT /api/v1/clinics/:id': 'ClinicController.putUpdateClinicInfo',

  'GET /api/v1/users/all': 'UserController.getAllUsers',
  // 'GET /users/:name': 'UserController.getUsersByName',

  'GET /api/v1/doctors': 'DoctorController.getAllDoctors',
  'GET /api/v1/doctors/:id': 'DoctorController.getDoctorInfo',
  // 'GET /api/v1/doctors': 'DoctorController.findDoctors',

  'POST /api/v1/order': 'OrderController.postMakeOrder',
  'DELETE /api/v1/order': 'OrderController.deleteCancelOrder',
  'PUT /api/v1/order': 'OrderController.putChangeStatusOrder',
  'GET /api/v1/order': 'OrderController.getOrderList',

  'POST /api/v1/online': 'OnlineController.postAddQuestion',
  'GET /api/v1/online': 'OnlineController.getAllQuestions',
  'GET /api/v1/online/:id': 'OnlineController.getQuestionInfo',
  'POST /api/v1/online/:id': 'OnlineController.postAddAnswer',
  'POST /api/v1/online/:id/close': 'OnlineController.postCloseQuestion',

  'GET /api/v1/admin/stats': 'AdminController.getStats',
  'POST /api/v1/admin/specialities': 'AdminController.postAddSpeciality',
};
