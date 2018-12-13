const supertest = require('supertest');
const DoctorService = require('../../api/services/DoctorService');
const UserService = require('../../api/services/UserService');
const assert = require('assert');

function isContainsParams(object, params) {
  let result = {};
  for (let i = 0; i < params.length; i++) {
    if (!object[params[i]]) {
      result.error = `Object ${object} doesn't have param '${params[i]}'`;
      return result;
    }
  }
  return result;
};

function setToArray(setInstance) {
  return Array.from(setInstance).sort((a ,b) => b - a);
}


describe('DataCheck', function() {

    describe('#allDoctors()', function() {
      it('should give you list of all doctors', function (done) {
        supertest(sails.hooks.http.app)
        .get('/api/v1/doctors')
        .expect(200)
        .end(function(err, response) {
            let doctors = response.body;
            const doctorParams = ['doctor_id', 'speciality_id', 'experience', 'last_name', 'first_name', 'middle_name' ];

            for(let i = 0; i < doctors.length; ++i)  {
                let doctor = doctors[i];

                let checkResult = isContainsParams(doctor, doctorParams);
                if(checkResult.error) return done(new Error(checkResult.error));
            };
            done();
        });
        
      });
    });

    describe('#allClinics()', function() {
      it('should give you list of all clinics', function (done) {
        supertest(sails.hooks.http.app)
        .get('/api/v1/clinics')
        .expect(200)
        .end(function(err, response) {
            let clinics = response.body;
            const clinicParams = ['id', 'name', 'address', 'doctors' ];

            for(let i = 0; i < clinics.length; ++i)  {
                let clinic = clinics[i];

                let checkResult = isContainsParams(clinic, clinicParams);
                if(checkResult.error) return done(new Error(checkResult.error));
            };
            done();
        });
        
      });
    });

    describe('#checkDoctorsRole()', function() {
      it('checks that all users with role doctor are written in Doctors table', async function () {
        var doctorList = await DoctorService.getAllDoctors();
        let doctorIDs = new Set();
        let doctorIDs2 = new Set();

        doctorList.forEach(function(doctor) {
          doctorIDs.add(doctor.doctor_id);
        });

        var userList = await UserService.getAllUsers();
        userList.forEach(function(user) {
          if(user.type === 'doctor') {
            doctorIDs2.add(user.id);
          }
        });
        
        doctorIDs = setToArray(doctorIDs);
        doctorIDs2 = setToArray(doctorIDs2);
        assert.ok(doctorIDs.length == doctorIDs2.length && doctorIDs.every(function(id, i) { return doctorIDs2[i] === id }));
      });
    });

    describe('#checkDoctorTimesheet()', function() {
      it('checks that doctors do not have several timesheet rows in one time', async function () {
        var timesheetRows = await DoctorService.getDuplicateTimesheetRows();
        assert.ok(timesheetRows.length === 0);
      });
    });

    describe('#checkOrders()', function() {
      it('checks that there are no orders for incorrect time', async function () {
        var orders = await DoctorService.getWrongOrderRows();
        assert.ok(orders.length === 0);
      });
    });
  
  });