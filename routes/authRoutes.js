const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const isAuthenticated = require('../helpers/jwtAuth');
const secret = '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd4ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611';

const Admin = require('../schemas/Admin');

const authRouter = express.Router();

async function generateAccessToken(email) {
  const user = await Admin.findOne({ email });

  return jwt.sign({ id: user._id }, secret, { expiresIn: '30d' });
}

authRouter.post('/add-admin', isAuthenticated, async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  if (await Admin.findOne({ email: req.body.email })) {
    res.status(400).json('כתובת דוא"ל זו כבר קיימת במערכת');
  }
  const admin = {
    email: req.body.email,
    password: hashedPassword,
  };

  (async () => {
    try {
      const newAdmin = new Admin(admin);
      await newAdmin.save();
      res.status(200).json('registered');
    } catch (error) {
      res.json(error);
    }
  })();
});

authRouter.post('/authenticate', async (req, res, next) => {
  passport.authenticate('local', async (err, admin) => {
    if (err) return res.status(400).json(err);

    if (!admin) return res.status(401).json('name or password not valid');

    const jwtBearerToken = await generateAccessToken(req.body.email);
    return res.status(200).json({
      idToken: jwtBearerToken,
      expiresIn: 30,
    });
  })(req, res, next);
});

module.exports = authRouter;