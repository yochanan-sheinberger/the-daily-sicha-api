const express = require('express');
const moment = require('moment');
const isAuthenticated = require('../helpers/jwtAuth');
const uploadFile = require('../helpers/multer');
const isSecondHoliday = require('../helpers/hebcal');

const DailySicha = require('../schemas/DailySicha');
const Sichos = require('../schemas/Sichos');
const Year = require('../schemas/Year');

const dailySichaRouter = express.Router();

dailySichaRouter.post('/add-sichos-files', isAuthenticated, uploadFile, async (req, res) => {
  try {
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
      res.json({ message: 'השיחות הועלו בהצלחה' })
    } else {
      res.json({ message: 'השיחות הועלו בהצלחה' });
    }
  } catch (err) {
    res.json(err)
  }

});

dailySichaRouter.post('/add-sichos-data', isAuthenticated, async (req, res) => {
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
  res.json({ message: 'השיחות הועלו בהצלחה' });
})

dailySichaRouter.post('/add-sichos-dates', isAuthenticated, uploadFile, async (req, res) => {
  if (req.body.year) {
    const a = await Year.updateMany({}, { $addToSet: { years: req.body.year } }, { upsert: true });
  }
  const bulkData = await JSON.parse(req.body.docs).map(day => (
    {
      updateOne: {
        filter: { date: day.date },
        update: day,
        upsert: true,
      }
    }
  ))
  const sichos = await DailySicha.bulkWrite(bulkData);
  res.json({ message: 'השיחות הועלו בהצלחה' })
})

dailySichaRouter.post('/add-year-sichos', isAuthenticated, uploadFile, (req, res) => {
  res.json({ message: 'השיחות הועלו בהצלחה' })
})

dailySichaRouter.get('/get-Years', async (req, res) => {
  const years = await Year.findOne({});
  res.json(years);
});

dailySichaRouter.get('/get-daily-sicha', async (req, res) => {
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
  let sicha = null;
  if (day) {
    sicha = await Sichos.findOne({ id: day.id }, 'abstract content contentHeb contentMobile contentHebMobile recUrl');
  }
  res.json({ sicha, day });

})

dailySichaRouter.post('/search-sicha', async (req, res) => {
  const field = req.body.field;
  let sichos = await Sichos.find({ [field]: { $regex: new RegExp(req.body.value) }, ...req.body.selectedSubjects }, `${field} id`).limit(12).skip(req.body.page * 12);
  sichos = sichos.map(sicha => {
    let text = sicha[field];
    const index = text.indexOf(req.body.value);
    if (field === 'abstractText') {
      text = text.slice(0, index) + '<mark>' + req.body.value + '</mark>' + text.slice(index + req.body.value.length, text.length);
    } else {
      text = (index > 250 ? '...' : '') + text.slice(index > 250 ? index - 250 : 0, index) + '<mark>' + req.body.value + '</mark>' + text.slice(index + req.body.value.length, index + 250) + '...'
    }
    return {
      id: sicha.id,
      [field]: text,
    }
  });
  const count = await Sichos.find({ [field]: { $regex: new RegExp(req.body.value) }, ...req.body.selectedSubjects }).countDocuments();
  res.json({ sichos, count });
})

dailySichaRouter.get('/get-search-sicha', async (req, res) => {
  const sicha = await Sichos.findOne({ id: req.query.id }, 'abstract content contentHeb contentMobile contentHebMobile recUrl deliveredDate deliveredYear');
  res.json(sicha);
})

dailySichaRouter.get('/get-base-url', (req, res) => {
  const url = `${req.protocol}://${req.get('host')}`;
  res.json(url);
})

function flatten(ary) {
  return ary.reduce(function (a, b) {
    if (Array.isArray(b)) {
      return a.concat(flatten(b));
    }
    return a.concat(b);
  }, []);
}

dailySichaRouter.get('/get-subjects', async (req, res) => {
  const subjects = await Sichos.aggregate([
    {
      $sort: {
        idA: 1,
      },
    },
    {
      $group: {
        _id: null,
        subjects: { $addToSet: '$subjects' },
        weekDay: { $addToSet: '$weekDay' },
        parshaNum: { $addToSet: '$parshaNum' },
        monthNum: { $addToSet: '$monthNum' },
        monthDay: { $addToSet: '$monthDay' },
        deliveredDate: { $push: '$deliveredDate' },
        deliveredYear: { $push: '$deliveredYear' },
      }
    },
  ]);
  const rambam = await Sichos.aggregate([
    {
      $sort: {
        rambamLesson: 1,
      },
    },
    {
      $group: {
        _id: null,
        rambamHalacha: { $push: '$rambamHalacha' },
        rambamLesson: { $push: '$rambamLesson' },
      }
    },
  ]);
  
  const rambamHalacha = rambam[0].rambamHalacha.filter(el => el !== '');
  const rambamLesson = rambam[0].rambamLesson.filter(el => el !== '');
  rambamHalacha.unshift('ללא');
  rambamLesson.unshift('ללא');

  subjects[0].subjects = flatten(subjects[0].subjects)
  subjects[0].subjects = [...new Set(subjects[0].subjects)].sort();
  subjects[0].subjects.splice(0, 1, 'ללא');
  subjects[0].rambamHalacha = rambamHalacha;
  subjects[0].rambamLesson = rambamLesson;
  subjects[0].weekDay.sort().splice(0, 1, 'ללא');
  subjects[0].parshaNum.sort((a, b) => {
    return a - b;
  });
  subjects[0].parshaNum.splice(0, 1, 'ללא');
  subjects[0].monthNum.sort((a, b) => {
    return a - b;
  });
  subjects[0].monthNum.splice(0, 1, 'ללא');
  subjects[0].monthDay.sort().splice(0, 1, 'ללא');
  subjects[0].deliveredDate = [...new Set(subjects[0].deliveredDate)];
  subjects[0].deliveredYear = [...new Set(subjects[0].deliveredYear)];
  subjects[0].deliveredDate.unshift('ללא');
  subjects[0].deliveredYear.unshift('ללא');
  res.json(subjects);
});

dailySichaRouter.post('/filter-subjects', async (req, res) => {
  let subjects;
  if (req.body.field === 'deliveredYear') {
     subjects = await Sichos.aggregate([
      {
        $sort: {
          idA: 1,
        },
      },
      {
        $match: {
          deliveredYear: req.body.value,
        }
      },
      {
        $group: {
          _id: null,
          deliveredDate: { $push: '$deliveredDate' },
        }
      },
    ]);
    subjects = [...new Set(subjects[0].deliveredDate)];
  } else {
    subjects = await Sichos.find({ [req.body.field]: req.body.value }).distinct(req.body.subField).sort();
  }
  res.json(subjects);
});



module.exports = dailySichaRouter;