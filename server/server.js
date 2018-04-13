const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');

const app = express();
app.listen(9000, () => {
  console.log('App is on 9000');
});

app.use(bodyParser.json());
app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
    // completed: false,
    // completedAt: 0
  });
  todo.save().then(doc => {
    res.send(doc)
  }, err => {
    res.status(400).send(err);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({ todos })
  }, e => {
    res.status(400).send(e);
  });
});

module.exports = { app };