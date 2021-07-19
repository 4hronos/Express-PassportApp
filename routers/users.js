const express = require("express");
const { User } = require("../dbConfig/models");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { forwardAuthenticated } = require("../auth/auth");

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register")
);

router.post("/register", (req, res) => {
  const { name, email, password, username } = req.body;
  let errors = [];
  console.log(res.locals);
  if (!name || !email || !password || !username) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      username,
    });
  } else {
    User.findOne({
      where: {
        email: email,
      },
    }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          username,
        });
      } else {
        const newUser = User.build({
          name,
          email,
          password,
          username,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
