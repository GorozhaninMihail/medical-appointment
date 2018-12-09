var sails = require('sails');

before(function(done) {

  this.timeout(60000);

  sails.lift({
    hooks: { grunt: false },
    log: { level: 'warn' },

  }, function(err) {
    if (err) { return done(err); }
    return done();
  });
});

after(function(done) {
  sails.lower(done);
});