const express = require('express');
const multer = require('multer')
const DailySicha = require('../schemas/DailySicha');

const dailySichaRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'cont') {
      cb(null, 'public/pdf/')
    } else if (file.fieldname === 'contHeb') {
      cb(null, 'public/pdfHeb/')
    } else if (file.fieldname === 'recs') {
      cb(null, 'public/records/')
    }
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname)
  }
})

const upload = multer({ storage });

dailySichaRouter.post('/add-daily-sichos', upload.any(), async (req, res) => {
  console.log(req.files);
  // const sichos = await DailySicha.insertMany(JSON.parse(req.body.docs));
  const bulkData = JSON.parse(req.body.docs).map(sicha => (
    {
      updateOne: {
        filter: { date: sicha.date },
        update: sicha,
        upsert: true,
      }
    }
  ))
  const sichos = await DailySicha.bulkWrite(bulkData);
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
  const terms = req.body.fields.map(term => {
    return { [term]: { $regex: new RegExp(req.body.value) } }
  })
  console.log(terms);
  const count = await DailySicha.find({ $or: terms }).count();
  const sichos = await DailySicha.find({ $or: terms }).limit(3).skip(req.body.page * 3);
  // console.log(sichos);
  res.json({sichos, count});
})

dailySichaRouter.get('/get-base-url', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  res.json(url);
})

module.exports = dailySichaRouter;