const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jsonwebtoken = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');


const validateRegisterInput = require('../../validation/register.js');
const validateLoginInput = require('../../validation/login.js');


router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
})

router.post('/register', (req, res) => {
 
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          // Throw a 400 error if the email address already exists
          return res.status(400).json({email: "Email already exists"})
        } else {
          // Otherwise create a new user
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  const payload = { id: user.id, name: user.name };
    
                  jsonwebtoken.sign(payload,
                     keys.secretOrKey, 
                     { expiresIn: 3600 },
                      (err, token) => {
                    res.json({
                      success: true,
                      token: "Bearer " + token
                    });
                  });
                })
                .catch(err => console.log(err));
            })
          })
        }
      })
  })

router.post('/login', (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    debugger;
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  

  User.findOne({email})
    .then(user => {
      if (!user) {
        debugger
        return res.status(404).json({email: 'This user does not exist'});
      }

      bcrypt.compare(password, user.password)
      .then(isMatch => {
          if (isMatch) {
          const payload = {id: user.id, name: user.name};

          jsonwebtoken.sign(
              payload,
              keys.secretOrKey,
              // Tell the key to expire in one hour
              {expiresIn: 3600},
              (err, token) => {
              res.json({
                  success: true,
                  token: 'Bearer ' + token
              });
              });
          } else {
          return res.status(400).json({password: 'Incorrect password'});
          }
      })
    })
  })





module.exports = router;
