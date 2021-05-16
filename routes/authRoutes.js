const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const Admin = require('../schemas/Admin');

const authRouter = express.Router();
const RSA_PRIVATE_KEY = fs.readFileSync(path.resolve(__dirname, '../../jwtRS256.key'), () => { });

async function generateJWT(name) {
  const user = await Admin.findOne({ name });

  const jwtBearerToken = await jwt.sign({}, RSA_PRIVATE_KEY, {
    algorithm: 'RS256',
    expiresIn: '30 days',
    subject: user.id,
  });

  return jwtBearerToken;
}

authRouter.post('/add-user', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  if (await Admin.findOne({ name: req.body.name })) {
    res.status(400).json('כתובת דוא"ל זו כבר קיימת במערכת');
  }
  const admin = {
    name: req.body.name,
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

    const jwtBearerToken = await generateJWT(req.body.name);
    return res.status(200).json({
      name: admin.name,
      idToken: jwtBearerToken,
      expiresIn: 30,
    });
  })(req, res, next);
});

module.exports = authRouter;