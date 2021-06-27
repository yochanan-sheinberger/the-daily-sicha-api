const mongoose = require('mongoose');

const dedication = mongoose.Schema({
  fullName: String,
  address: String,
  email: String,
  phone: String,
  notes: String,
  date: {
    type: Date,
    default: new Date(),
  },
  dedications: [{
    date: String,
    event: String,
    name: String,
    parent: String,
    donor: String,
  }],
});

const Dedication = mongoose.model('Dedication', dedication);

module.exports = Dedication;