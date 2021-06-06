const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

const dailySichaRouter = require('./routes/dailySichaRoutes');
const topicRouter = require('./routes/topicRoutes');
const authRouter = require('./routes/authRoutes');

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use('/public', express.static('public'));
app.use('/daily-sicha', dailySichaRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

const start = async () => {
  mongoose.connect(`mongodb+srv://yochanan:${encodeURIComponent('?8MMECsX2up!')}@sichos.qerhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

  app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  })
}

module.exports = start;
