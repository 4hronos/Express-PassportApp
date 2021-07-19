const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { User } = require("../dbConfig/models");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        User.findOne({
          where: {
            email: email,
          },
        }).then((user) => {
          if (!user) {
            return done(null, false, {
              message: "This email is not registered",
            });
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Username or password is incorrect",
              });
            }
          });
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findOne(
      {
        where: {
          id: id,
        },
      }).then((user) => {
        done(null, user.get());
      })

  });
};
