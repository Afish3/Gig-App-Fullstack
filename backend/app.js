"use strict";

/** Express app for Gig Bears. */

const express = require("express");
const cors = require("cors");
require("colors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const jobsRoutes = require("./routes/jobs");

const morgan = require("morgan");
const session = require("express-session");

// configured passport in ./passport.js
const passport = require("./passport");

const app = express();

/** Allow development environment and localhost frontend to interact with API 
 * sending and receieving cookies.
 */

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

const sess = {
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
  sess.cookie.maxAge = 1000 * 60 * 60 * 24 * 7 // One Week
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/jobs", jobsRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
