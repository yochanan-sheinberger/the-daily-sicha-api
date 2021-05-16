const express = require('express');
const multer = require('multer')
const DailySicha = require('../schemas/DailySicha');

const dailySichaRouter = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/records/')
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname)
  }
})

const upload = multer({ storage });

dailySichaRouter.post('/add-daily-sichos', upload.array('recs'), async (req, res) => {
  console.log(req.files);
  const sichos = await DailySicha.insertMany(JSON.parse(req.body.docs));
  res.json(sichos)
})

dailySichaRouter.get('/get-Daily-sicha', async (req, res) => {
  console.log(req.query.date);
  const sicha = await DailySicha.find({date: req.query.date});
  console.log(sicha);
  res.json(sicha);
})

dailySichaRouter.post('/search-sicha', async (req, res) => {
  console.log(req.body);
  const terms =req.body.fields.map(term => {
    return { [term]: { $regex: new RegExp(req.body.value) } }
  })
  console.log(terms);
  // const sichos = await DailySicha.find({ $or: terms});
  const sichos = await DailySicha.find({ $or: terms });
  console.log(sichos);
  res.json(sichos);
})

module.exports = dailySichaRouter;