const mongoose = require('mongoose');

const year = mongoose.Schema({
  years: [String],
});

const Year = mongoose.model('Year', year);

module.exports = Year;