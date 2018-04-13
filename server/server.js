const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');

const app = express();

const port = process.env.PORT || '9000';

app.listen(port, () => {
  console.log(`App is on port ${port}`);
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

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }
  Todo.findById(id)
    .then(todo => {
      if (todo) {
        console.log(JSON.stringify(todo, undefined, 2));
        res.send({ todo });
      } else res.status(404).send({});
    }, er => {
      res.status(400).send();
    }
  )
  .catch(() => { res.status(400).send(); });
});

module.exports = { app };