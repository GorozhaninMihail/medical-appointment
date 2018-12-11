var supertest = require('supertest');

function isContainsParams(object, params) {
  let result = {};
  for (let i = 0; i < params.length; i++) {
    if (!object[params[i]]) {
      result.error = `Object ${object} doesn't have param '${params[i]}'`;
      return result;
    }
  }
  return result;
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
  
  });