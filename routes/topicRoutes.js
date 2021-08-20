const express = require('express');
ObjectID = require('mongodb').ObjectID;
const isAuthenticated = require('../helpers/jwtAuth');
const uploadFile = require('../helpers/multer');

const Topic = require('../schemas/Topic');

const topicRouter = express.Router();

topicRouter.post('/add-topic-files', isAuthenticated, uploadFile, async (req, res) => {
  console.log(JSON.parse(req.body.docs));

  try {
    if (req.body.docs) {
      console.log(JSON.parse(req.body.docs));
      const bulkData = JSON.parse(req.body.docs).map(sicha => (
        {
          updateOne: {
            filter: { id: sicha.id, topic: sicha.topic },
            update: sicha,
            upsert: true,
          }
        }
      ))
      const sichos = await Topic.bulkWrite(bulkData);
      res.json({ message: 'השיחות הועלו בהצלחה' })
    } else {
      res.json({ message: 'השיחות הועלו בהצלחה' });
    }
  }  catch (err) {
    res.json(err)
  }
});

topicRouter.get('/get-topic', async (req, res) => {
  const topic = await Topic.find({ topic: req.query.topic });
  res.json(topic);
});

topicRouter.get('/get-topic-sicha', async (req, res) => {
  const sicha = await Topic.findById(req.query.id);
  res.json(sicha);
});

topicRouter.get('/get-topic-titles', async (req, res) => {
  const topics = await Topic.find().distinct('topic');
  res.json(topics);
});


module.exports = topicRouter;