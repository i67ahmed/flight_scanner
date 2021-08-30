const express = require('express');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/User');
const keys = require('../../config/keys');

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


//@route POST api/users/register
//@desc Register a users
//@access public

router.post('/register', (req, res) => {
  //validation
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm',
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar,
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    })
    .catch((err) => console.log(err));
});


//@route POST api/users/login
//@desc Login a user and generate a token
//@access public

router.post('/login', (req, res) => {
  //validation
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          //Payload
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };

          //Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              return res.json({ token: 'Bearer ' + token });
            }
          );
        } else {
          return res.status(400).json({ password: 'Incorrect password' });
        }
      });
    })
    .catch((err) => console.log(err));
});


//@route GET api/users/current
//@desc Return current user info
//@access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;