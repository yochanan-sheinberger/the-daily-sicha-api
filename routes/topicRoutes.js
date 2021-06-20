const express = require('express');
ObjectID = require('mongodb').ObjectID;
const multer = require('multer');
const isAuthenticated = require('../helpers/jwtAuth');
const upload = require('../helpers/multer');

const Topic = require('../schemas/Topic');

const topicRouter = express.Router();

topicRouter.post('/add-topic', isAuthenticated, upload.any(), async (req, res) => {
  const sichos = JSON.parse(req.body.docs);
  const topicExist = await Topic.findOne({topic: req.body.topic});
  if (topicExist) {
    const filteredSichos = topicExist.sichos.filter(sicha => {
      return !sichos.some(s => s.title === sicha.title)
    });
    topicExist.sichos = [...filteredSichos, ...sichos];
    topicExist.save();
    res.json('updated');
  } else {
    const newTopic = new Topic({
      topic: req.body.topic,
      sichos: JSON.parse(req.body.docs),
    });
    await newTopic.save();
    res.json(newTopic)
  }

});

topicRouter.get('/get-topic', async (req, res) => {
  const topic = await Topic.findById(req.query.id);
  res.json(topic);
});

topicRouter.get('/get-topic-sicha', async (req, res) => {
  const topic = await Topic.find({"sichos._id": ObjectID(req.query.id)});
  const sicha = topic[0].sichos.filter(sicha => {
    return sicha._id.toString() === req.query.id;
  })
  res.json(sicha);
});

topicRouter.get('/get-topic-titles', async (req, res) => {
  const topics = await Topic.find({}).select('topic');
  res.json(topics);
});


module.exports = topicRouter;