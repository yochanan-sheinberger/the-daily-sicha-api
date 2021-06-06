const express = require('express');
ObjectID = require('mongodb').ObjectID;
const multer = require('multer')
const Topic = require('../schemas/Topic');

const topicRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'cont') {
      cb(null, 'public/pdf/')
    } else if (file.fieldname === 'contHeb') {
      cb(null, 'public/pdfHeb/')
    } else if (file.fieldname === 'recs') {
      cb(null, 'public/records/')
    }
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname)
  }
})

const upload = multer({ storage });

topicRouter.post('/add-topic', upload.any(), async (req, res) => {
  const sichos = JSON.parse(req.body.docs);
  const topicExist = await Topic.findOne({topic: req.body.topic});
  if (topicExist) {
    const filteredSichos = topicExist.sichos.filter(sicha => {
      console.log(sicha.title, sichos.map(s => s.title));

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
  console.log(req.query.id);
  const topic = await Topic.find({"sichos._id": ObjectID(req.query.id)});
  const sicha = topic[0].sichos.filter(sicha => {
    console.log(sicha._id.toString() === req.query.id);
    return sicha._id.toString() === req.query.id;
  })
  console.log(sicha);
  res.json(sicha);
});

topicRouter.get('/get-topic-titles', async (req, res) => {
  const topics = await Topic.find({}).select('topic');
  res.json(topics);
});


module.exports = topicRouter;