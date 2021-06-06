const mongoose = require('mongoose');

const dailySicha = mongoose.Schema({
  date: String,
  abstract: String,
  content: String,
  contentText: String,
  contentHeb: String,
  contentHebText: String,
  recUrl: String,
  dedication: String,
});

const DailySicha = mongoose.model('DailySicha', dailySicha);

module.exports = DailySicha;