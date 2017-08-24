const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const mongoose = require('mongoose');

const STATUS_USER_ERROR = 422;
const STATUS_SERVER_ERROR = 500;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(session({
  secret: 'e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re',
  resave: true,
  saveUninitialized: false
}));

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};

// TODO: implement routes

// POST /users
server.post('/users', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    // res.status(STATUS_USER_ERROR);
    // res.json({ error: 'Please provide a username and password' });
    sendUserError('Please provide a username and password', res);
    return;
  }
  const user = new User({ username, password });
  user.save((err) => {
    if (err) {
      res.status(STATUS_SERVER_ERROR);
      res.json(err);
    } else {
      res.json(user);
    }
  });
});

// TODO: add local middleware to this route to ensure the user is logged in
// server.get('/me', (req, res) => {
  // Do NOT modify this route handler in any way.
//   res.json(req.user);
// });

module.exports = { server };
