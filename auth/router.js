const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const router = require("express").Router();

const Users = require("../users/users-model.js");
const secrets = require('../config/secrets.js');

router.post("/register", (req, res) => {
  const user = req.body;

  const ROUNDS = process.env.HASHING_ROUNDS || 8;
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  user.password = hash;
  const token = generateToken(user);

  Users.add(user)
    .then(user => {
      res.status(201).json({
        token: token,
        message: `Welcome ${user.username}`,  
      });
    })
    .catch(err => res.send(err));
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        // req.session.user = {
        //   id: user.id,
        //   username: user.username,
        res.status(200).json({ message: `Welcome ${user.username}!, have a token ....`})
      } else {
        res.status(401).json({ message: "invalid credentials" });
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: "error finding the user" });
    });
});

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

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(error => {
      if (error) {
        res
          .status(500)
          .json({
            message:
              "you can checkout any time you like, but you can never leave....",
          });
      } else {
        res.status(200).json({ message: "logged out successful" });
      }
    });
  } else {
    res.status(200).json({ message: "I don't know you" });
  }
});

module.exports = router;
