const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

Todo.remove({})
  .then((result) => {
    console.log(result);
  });

Todo.findOneAndRemove({_id: '5ad0b3c8988d7afc6a1c8789'})
  .then((result) => {
    console.log(result);
  });
