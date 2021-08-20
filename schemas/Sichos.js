const mongoose = require('mongoose');

const sichos = mongoose.Schema({
  id: Number,
  idA: String,
  parshaNum: Number,
  parsha: String,
  weekDay: String,
  monthNum: Number,
  month: String,
  monthDay: String,
  subjects: [String],
  rambamLesson: String,
  rambamHalacha: String,
  deliveredDate: String,
  deliveredYear: String,
  abstract: String,
  abstractText: String,
  content: String,
  contentMobile: String,
  contentText: String,
  contentHeb: String,
  contentHebMobile: String,
  contentHebText: String,
  recUrl: String,
});

const Sichos = mongoose.model('Sichos', sichos);

module.exports = Sichos;