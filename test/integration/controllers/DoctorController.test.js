var supertest = require('supertest');

describe('DoctorController', function() {

    describe('#allDoctors()', function() {
      it('should give you list of all doctors', function (done) {
        supertest(sails.hooks.http.app)
        .get('/api/v1/doctors')
        .expect(200)
        .end(function(err, response) {
            let doctors = response.body;
            for(let i = 0; i < doctors.length; ++i)  {
                let doctor = doctors[i];
                if(!doctor.doctor_id) return done(new Error(`Doctor ${doctor} doesn't have 'doctor_id'.`));
                if(!doctor.speciality_id) return done(new Error(`Doctor ${doctor} doesn't have 'speciality_id'.`));
                if(!doctor.experience) return done(new Error(`Doctor ${doctor} doesn't have 'experience'.`));
                if(!doctor.last_name) return done(new Error(`Doctor ${doctor} doesn't have 'last_name'.`));
                if(!doctor.first_name) return done(new Error(`Doctor ${doctor} doesn't have 'first_name'.`));
                if(!doctor.middle_name) return done(new Error(`Doctor ${doctor} doesn't have 'middle_name'.`));
            };
            done();
        });
        
      });
    });
  
  });