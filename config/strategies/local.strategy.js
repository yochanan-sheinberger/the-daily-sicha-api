const passport = require('passport');
const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');
const { Admin } = require('../../schemas/Admin');

function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'name',
  }, (name, password, done) => {
    (async () => {
      try {
        const admin = await Admin.findOne({ name });
        if (admin && await bcrypt.compare(password, admin.password)) {
          done(null, admin);
        } else {
          done(null, false);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }));
}

module.exports = localStrategy;
