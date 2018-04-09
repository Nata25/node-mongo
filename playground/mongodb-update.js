const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
    console.log('Unable to connect to db server');
  } else {
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate(
    {_id: new ObjectID('5acba8f6108eb538f454fd60')}, 
    {
      $set: {
        name: 'Natalia'
      },
      $inc: {
        age: 1,
      }
    },
    {
      returnOriginal: false
    })
  .then( ({ value }) => {
    console.log(value);
  });

  client.close();

  }

});