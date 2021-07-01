const mongoose = require('mongoose');

const dailySicha = mongoose.Schema({
  id: Number,
  date: String,
  title: String,
  dedication: String,
});

const DailySicha = mongoose.model('DailySicha', dailySicha);

module.exports = DailySicha;