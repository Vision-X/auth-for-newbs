const express = require('express');
// for validation
const Joi = require('joi');
const bcrypt = require('bcryptjs');


const db = require('../db/connection');
//connects to user store
const users = db.get('users');
//for forcing mongodb to store username as a unique key
users.createIndex('username', { unique:true });
//find aka check if a username is unique



const router = express.Router();

// any route in here is pre-pended with /auth

const schema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_$)]+$)/).min(2).max(30).required() ,
  password: Joi.string().min(8).max(30).required(),
})

router.get('/', (req, res) => {
  res.json({
    message:  '🔐'
  });
});

router.post('/signup', (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    //
    console.log(req.body, "hey")
    users.findOne({
      username: req.body.username
    }).then(user => {
      // if user is undefined, username is not in the db,
      // otherwise duplicate user detected
      if (user) {
        //there is already a user in the db with this username...
        //respond with error!
        const error = new Error('That username is taken. Please select a different one.');
        // takes this error and forwards it to the error handler
        next(error);
      } else {
        //hash the password w/ bcryptjs
        //insert user into db with hashed password
        bcrypt.hash(req.body.password, 12).then(hashedPassword => {
          res.json({ hashedPassword });
          const newUser = {
            username: req.body.username,
            password: hashedPassword
          };

          users.insert(newUser).then(insertedUser => {
            res.json(insertedUser);
          })
        });
      }
    });

  } else {
    next(result.error);
  }
});

module.exports = router;
