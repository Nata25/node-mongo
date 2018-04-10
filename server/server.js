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

// Todo.find().then(todos => {
//   console.log('total todos:', todos.length);
// })

// const newUser = new User({
//   // email: 'natalya@example.com'
//   // email: ''
//   email: '123@gmail.com'
// });

// newUser.save().then(doc => {
//   console.log(`New student added: ${doc}.`);
// }, err => {
//   console.log(`Unable to save new student: ${err}.`);
// });

module.exports = { app };