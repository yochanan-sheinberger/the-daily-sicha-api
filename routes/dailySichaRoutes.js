const express = require('express');
const moment = require('moment');

const isAuthenticated = require('../helpers/jwtAuth');
const upload = require('../helpers/multer');
const isSecondHoliday = require('../helpers/hebcal');

const DailySicha = require('../schemas/DailySicha');
const Sichos = require('../schemas/Sichos');

const dailySichaRouter = express.Router();

dailySichaRouter.post('/add-sichos-files', isAuthenticated, upload.any(), async (req, res) => {
  if (req.body.docs) {
    const bulkData = JSON.parse(req.body.docs).map(sicha => (
      {
        updateOne: {
          filter: { id: sicha.id },
          update: sicha,
          upsert: true,
        }
      }
    ))
    const sichos = await Sichos.bulkWrite(bulkData);
    res.json(sichos)
  } else {
    res.json('success');
  }
});

dailySichaRouter.post('/add-sichos-data', isAuthenticated, async (req, res) => {
  // console.log(req.body);
  const bulkData = req.body.docs.map(sicha => (
    {
      updateOne: {
        filter: { id: sicha.id },
        update: sicha,
        upsert: true,
      }
    }
  ))
  const sichos = await Sichos.bulkWrite(bulkData);
  res.json(sichos)
})

dailySichaRouter.post('/add-sichos-dates', isAuthenticated, async (req, res) => {
  // console.log(req.body);
  const bulkData = req.body.map(day => (
    {
      updateOne: {
        filter: { id: day.id },
        update: day,
        upsert: true,
      }
    }
  ))
  const sichos = await DailySicha.bulkWrite(bulkData);
  res.json(sichos)
})

dailySichaRouter.get('/get-Daily-sicha', async (req, res) => {
  let day = await DailySicha.findOne({ date: req.query.date });
  if (!day) {
    let date = moment(req.query.date, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
    day = await DailySicha.findOne({ date: date });
    if (!day) {
      let operator = 'add';
      if (isSecondHoliday(moment(req.query.date, 'DD-MM-YYYY'))) {
        operator = 'subtract';
      }
      for (let i = 0; i < 5 && !day; i++) {
        date = moment(date, 'DD-MM-YYYY')[operator](1, 'days').format('DD-MM-YYYY');
        day = await DailySicha.findOne({ date: date });
      }
    }
  }
  console.log(date);
  console.log(day);
  const sicha = await Sichos.findOne({ id: day.id}, 'abstract content contentHeb recUrl');
  console.log(sicha);
  res.json({sicha, day});
})

dailySichaRouter.post('/search-sicha', async (req, res) => {
  const terms = req.body.fields.map(term => {
    return { [term]: { $regex: new RegExp(req.body.value) } }
  })
  const count = await Sichos.find({ $or: terms }).count();
  const sichos = await Sichos.find({ $or: terms }, 'abstract').limit(12).skip(req.body.page * 12);
  res.json({ sichos, count });
})

dailySichaRouter.get('/get-search-sicha', async (req, res) => {
  const sicha = await Sichos.findById(req.query.id, 'abstract content contentHeb recUrl deliveredDate deliveredYear');
  res.json(sicha);
})

dailySichaRouter.get('/get-base-url', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  res.json(url);
})

module.exports = dailySichaRouter;