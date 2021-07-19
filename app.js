const express = require("express");
const ExpressHandlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
// public
app.use(express.static("public"));
const passport = require("passport");

// engine
app.engine(
  ".hbs",
  ExpressHandlebars({
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// utility middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var time = 360000;

app.use(
  session({
    name: "yoxlayan",
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    expires: new Date(Date.now() + time),
  })
);

require("./auth/passport")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// global vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// routers
app.use("/", require("./routers/index"));
app.use("/users", require("./routers/users"));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
