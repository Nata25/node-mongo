const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const user1ID = new ObjectID();
const user2ID = new ObjectID();

const users = [
  {
    _id: user1ID,
    email: 'user1@example.com',
    password: '123456',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: user1ID, access: 'auth'}, 'abc123').toString()
        // token: '111'
      }
    ]
  },
  {
    _id: user2ID,
    email: 'user2@example.com',
    password: '789012',
    tokens: []
  }
]

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
    completed: false,
    completedAt: null
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: false,
    completedAt: null
  }];

  const populateTodos = (done) => {
    Todo.remove({}).then(() => {
      Todo.insertMany(todos)
    })
    .then(() => { 
      done(); 
    });
  };

  const pupulateUsers = (done) => {
    User.remove({}).then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      return Promise.all([user1, user1]);
    })
    .then(() => {
      done();
    });
  };

  module.exports = { todos, users, populateTodos, pupulateUsers };