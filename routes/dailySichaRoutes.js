const express = require('express');
const moment = require('moment');

const isAuthenticated = require('../helpers/jwtAuth');
const upload = require('../helpers/multer');
const isSecondHoliday = require('../helpers/hebcal');

const DailySicha = require('../schemas/DailySicha');

const dailySichaRouter = express.Router();

dailySichaRouter.post('/add-daily-sichos', isAuthenticated, upload.any(), async (req, res) => {
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
  let sicha = await DailySicha.findOne({date: req.query.date}, '-contentText -contentHebText');
  if (!sicha) {
    let date = moment(req.query.date, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY');
    sicha = await DailySicha.findOne({date: date}, '-contentText -contentHebText');
    if (!sicha) {
      let operator = 'add';
      if (isSecondHoliday(moment(req.query.date, 'DD-MM-YYYY'))) {
        operator = 'subtract';
      }
      for (let i = 0; i < 5 && !sicha; i++) {
        date = moment(date, 'DD-MM-YYYY')[operator](1, 'days').format('DD-MM-YYYY');
        sicha = await DailySicha.findOne({date: date}, '-contentText -contentHebText');
      }
    }
  }
  res.json(sicha);
})

dailySichaRouter.post('/search-sicha', async (req, res) => {
  const terms = req.body.fields.map(term => {
    return { [term]: { $regex: new RegExp(req.body.value) } }
  })
  const count = await DailySicha.find({ $or: terms }).count();
  const sichos = await DailySicha.find({ $or: terms }, 'date abstract').limit(12).skip(req.body.page * 12);
  res.json({sichos, count});
})

dailySichaRouter.get('/get-base-url', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  res.json(url);
})

module.exports = dailySichaRouter;