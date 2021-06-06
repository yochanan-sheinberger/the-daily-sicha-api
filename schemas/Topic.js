const mongoose = require('mongoose');

const topic = mongoose.Schema({
  topic: String,
  sichos: [{
    title: String,
    abstract: String,
    content: String,
    contentHeb: String,
    recUrl: String,
    dedication: String,
  }],
});

const Topic = mongoose.model('Topic', topic);

module.exports = Topic;