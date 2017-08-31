const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const User = require('./user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

const isLoggedIn = (req, res, next) => {
  const username = req.session;
  if (username === null) {
    console.log('failing here');
    sendUserError('Please log in', res);
  } else {
  User.findOne({ username }), (err, user) => {
    if (err) {
      sendUserError('stuff', res);
    } else if (!user) {
      sendUserError('Please log in', res);
    } else {
      req.user = user;
      return next();
    }
  }
}

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
    sendUserError('Please provide a username and password', res);
    return;
  }
  bcrypt.hash(password, BCRYPT_COST, (err, passwordHash) => {
    if (err) {
      sendUserError(err, res);
    } else {
      const newUser = new User({ username, passwordHash });
      newUser.save((error, user) => {
        if (error) {
          // console.log(err);
          res.status(STATUS_SERVER_ERROR);
          res.json(error);
          // sendUserError(error, res);
        } else {
          res.json(user);
        }
      });
    }
  });
});

// POST /log-in
server.post('/log-in', (req, res) => {
// expect username and password
  const { username, password } = req.body;
  if (!username || !password) {
    sendUserError('Please provide a username and password', res);
    return;
  };
// check credentials and log in user
  User.findOne({ username })
    .exec()
    .then((user) => {
      if (!user) {
        sendUserError('Username not found, please retry', res);
      } else {
          bcrypt.compare(password, user.passwordHash, (error, isValid) => {
          if (error) {
            res.status(STATUS_SERVER_ERROR);
            res.json(error);
            return;
          }
          if (isValid) {
            req.session.username = user.username;
            res.json({ success: true });
          } else if (!isValid) {
            sendUserError('Username and password do not match, please retry', res);
          }
        });
      }
    })
// send { success: true }
// Use session to store id of logged in user
});

// TODO: add local middleware to this route to ensure the user is logged in
server.get('/me', isLoggedIn, (req, res) => {
  // Do NOT modify this route handler in any way.
//   const userID = req.session.userID;
//   if (err) {
//     res.status(STATUS_SERVER_ERROR);
//     res.send(err);
//   }
//   User.findOne({ _id: { $eq: userID } })
//     .exec((error, user) => {
//       if (error) {
//         res.status(STATUS_SERVER_ERROR);
//         res.send(error);
//       } else if (!user) {
// 	console.log('no user');
//         sendUserError('Please log in again', res);
//       }
//     });
//   console.log(user);
  res.json(req.user);
});
module.exports = { server };
