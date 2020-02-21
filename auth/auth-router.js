const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db = require('./auth-model.js');
const secrets = require('../data/secrets.js');

router.post('/register', validation, (req, res) => {
  const credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, 14);
  credentials.password = hash;

  db.createUser(req.body).then(response => {
    res.status(201).json({response: response});
  }).catch(err => {
    res.status(500).json({message: "Could not register user"});
  })
})

router.post('/login', validation, (req, res) => {
  const credentials = req.body;

  db.login(req.body).first().then(user => {
    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
      res.status(401).json({error: 'You shall not pass'});
    } else {
      const token = generateToken(user);
      res.status(200).json({
        message: `Welcome ${user.username}!, have a token...`,
        token
      });
    }
  }).catch(err => {
    res.status(500).json({message: "Could not log in"});
  })
})

router.get('/users', restricted, (req, res) => {
  db.getUsers().then(response => {
    res.status(200).json({users: response});
  }).catch(err => {
    res.status(500).json({message: "Could not get users"})
  })
})

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const options = {
    expiresIn: '1d',
  };

  return jwt.sign(payload, secrets.jwtSecret, options);
}

// Middleware

function validation(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.send({error: "Must provide username and password"})
  } else {
    next();
  }
}

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err) {
        res.status(401).json({message: "Invalid credentials"})
      } else {
        next();
      }
    })
  } else {
    res.status(401).json({message: "You shall not pass"})
  }
}

module.exports = router;
