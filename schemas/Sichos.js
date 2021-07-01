const mongoose = require('mongoose');

const sichos = mongoose.Schema({
  id: Number,
  idA: String,
  parshaNum: Number,
  parsha: String,
  weekDay: String,
  monthNum: Number,
  month: String,
  MonthDay: String,
  Issues: String,
  rambamLesson: String,
  rambamHalacha: String,
  deliveredDate: String,
  deliveredYear: String,
  abstract: String,
  content: String,
  contentText: String,
  contentHeb: String,
  contentHebText: String,
  recUrl: String,
});

const Sichos = mongoose.model('Sichos', sichos);

module.exports = Sichos;