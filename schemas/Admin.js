const mongoose = require('mongoose');

const admin = mongoose.Schema({
  name: String,
  password: String,
});

const Admin = mongoose.model('Admin', admin);

module.exports = Admin;