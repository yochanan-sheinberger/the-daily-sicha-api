const mongoose = require('mongoose');

const admin = mongoose.Schema({
  email: String,
  password: String,
});

const Admin = mongoose.model('Admin', admin);

module.exports = Admin;