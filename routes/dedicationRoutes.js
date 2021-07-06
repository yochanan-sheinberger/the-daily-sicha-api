const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const isAuthenticated = require('../helpers/jwtAuth');

const Dedication = require('../schemas/Dedication');

const dedicationRouter = express.Router();


dedicationRouter.post('/add-dedication', async (req, res) => {
  (async () => {
    try {
      const newDedication = new Dedication({...req.body});
      await newDedication.save();
      res.status(200).json('registered');
    } catch (error) {
      res.json(error);
    }
  })();
});

dedicationRouter.get('/get-dedications', isAuthenticated, async (req, res, next) => {
  const dedications = await Dedication.find({});
  res.json(dedications);
});

module.exports = dedicationRouter;