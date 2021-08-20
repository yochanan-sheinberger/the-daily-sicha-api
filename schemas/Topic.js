const mongoose = require('mongoose');

const topic = mongoose.Schema({
  topic: String,
  id: String,
  title: String,
  abstract: String,
  content: String,
  contentMobile: String,
  contentText: String,
  contentHeb: String,
  contentHebMobile: String,
  contentEng: String,
  contentEngMobile: String,
  recUrl: String,
});

const Topic = mongoose.model('Topic', topic);

module.exports = Topic;