const express = require("express");
const ExpressHandlebars = require("express-handlebars");
const flash = require("connect-flash");
const session = require("express-session");

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

app.use(
  session({
    name: "yoxlayan",
    secret: "thisIsOurLittleSecret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: new Date(Date.now()+ 0.1 * 3600000)
    }
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
