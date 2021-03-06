'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const db = require('../db/connection');
const { camelizeKeys, decamelizeKeys } = require('humps');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const util = require('./util');

router.get('/', util.authorize, (req, res, next) => {
  let user;

  db.raw(`
    SELECT u.id, u.first_name, u.last_name, u.email, u.username, u.h_pw,
      (SELECT img.cloudinary_url
      FROM images as img
      WHERE img.user_id = u.id AND img.profile = true)
    FROM users as u
    WHERE (u.id = ${req.claim.userId})
  `)
    .then((results) => {
      if (!results.rows.length) {
        boom.create(404, 'User not found.');
      }

      user = results.rows[0];

      delete user.h_pw;

      res.send(camelizeKeys(user));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const user = decamelizeKeys(req.body);

  bcrypt.hash(user.password, 12)
    .then((h_pw) => {
      delete user.password;
      user.h_pw = h_pw;

      return db('users').insert(user).returning('*');
    }, '*')
    .then((users) => {
      const newUser = users[0];
      const claim = { userId: newUser.id };
      const token = jwt.sign(claim, process.env.JWT_KEY, {
        expiresIn: '30 days'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 30),
        secure: router.get('env') === 'production'
      });

      delete newUser.h_pw;

      res.send(camelizeKeys(newUser));
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/', (req, res, next) => {
  const { first_name, last_name, username, email} = decamelizeKeys(req.body);

  db('users')
    .update({ first_name, last_name, username, email })
    .where('id', req.body.userId)
    .returning('*')
    .then((data) => {
      const user = data[0];

      delete user.h_pw;
      delete user.online;
      delete user.created_at;
      delete user.updated_at;

      res.send(camelizeKeys(user));
    })
});

router.post('/verify_username', (req, res, next) => {
  db('users')
    .where('username', req.body.username)
    .then((data) => {
      if (data.length) {
        res.send('Username already exists');
      }
      else {
        res.send(data);
      }
    })
});

router.post('/verify_email', (req, res, next) => {
  db('users')
    .where('email', req.body.email)
    .then((data) => {
      if (data.length) {
        res.send('Email already in use');
      }
      else {
        res.send(data);
      }
    });
})

module.exports = router;
