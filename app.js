let createError = require("http-errors");
let express = require("express");
let path = require("node:path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

//authentication
require("dotenv").config(); // Load environment variables from .env file
// Bring in the database
require("./app_api/models/db"); 

let indexRouter = require("./app_server/routes/index");
let usersRouter = require("./app_server/routes/users");
let travelRouter = require("./app_server/routes/travel");
let mealsRouter = require("./app_server/routes/meals");
let roomsRouter = require("./app_server/routes/rooms");
let aboutRouter = require("./app_server/routes/about");
let contactRouter = require("./app_server/routes/contact");
let newsRouter = require("./app_server/routes/news");
let apiRouter = require("./app_api/routes/index");
let loginRouter = require('./app_server/routes/login');
let recommendationsRouter = require('./app_server/routes/recommendations');
let profileRouter = require('./app_server/routes/profile');
let registerRouter = require('./app_server/routes/register');

let handlebars = require("hbs");

// wire in our authentication model
let passport = require("passport");
const { receiveMessageOnPort } = require("node:worker_threads");
const { register } = require("node:module");
require("./app_api/config/passport");


let app = express();

// view engine setup
app.set("views", path.join(__dirname, "app_server", "views"));
// register handlebars partials (https://www.npmjs.com/package/hbs)
handlebars.registerPartials(
  path.join(__dirname + "/app_server/views/partials"),
);

app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize()); // Initialize Passport for authentication

// Enable CORS
app.use("/api", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // Allow requests from Angular app
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  next();
});
app.use('/login', loginRouter);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/travel", travelRouter);
app.use("/meals", mealsRouter);
app.use("/rooms", roomsRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);
app.use("/news", newsRouter);
app.use("/api", apiRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/profile', profileRouter);
app.use('/register', registerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Catch unauthorized error and create 401
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: err.name + ": " + err.message });
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
