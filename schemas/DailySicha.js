const mongoose = require('mongoose');

const dailySicha = mongoose.Schema({
  id: Number,
  sicha: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sichos',
  },
  date: String,
  title: String,
  dedication: String,
  dedicationRec: String,
});

const DailySicha = mongoose.model('DailySicha', dailySicha);

module.exports = DailySicha;