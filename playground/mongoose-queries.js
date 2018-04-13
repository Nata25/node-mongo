const { ObjectID } = require('mongodb');
const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '5ad07a220ad8765042e57b5f';
const userID = '5acc792e01a3fa4130f953fb';

if (!ObjectID.isValid(id)) {
  console.log('Id not valid.');
  return
}

Todo.find({ _id: id })
  .then(todos => {
    console.log(todos);
  });

Todo.findOne({ _id: id })
  .then(todo => {
    console.log(todo);
  });

Todo.findById(id).then( todo => { 
  if (!todo) {
    console.log('Id not found');
  } else console.log(todo); 
})
  .catch( e => { 
    console.log(e); 
  });

// User

User.findById({ _id: userID })
  .then(user => {
    if (!user) {
      console.log('User not found');
      return;
    }
    console.log('User:', JSON.stringify(user, undefined, 2));
  }, er => {
    console.log(er);
  });
