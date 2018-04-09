const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
    console.log('Unable to connect to db server');
  } else {
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    db.collection('Users').insertOne({
      name: 'Duplicate User',
      age: 35
    }, (error, result) => {
      if (error) {
        return console.log('Unable to insert data to db.');
      }
      console.log('Data was inserted on', result.ops[0]._id.getTimestamp());
    });

    db.collection('Todos').insertOne({
      // text: 'Get better',
      text: 'Learn MongoDB',
      isCompleted: 'false'
    }, (error, result) => {
      if (error) {
        return console.log('Unable to insert data to db.');
      }
      console.log('Data was inserted:', JSON.stringify(result.ops, undefined, 2));
    });
    
    client.close();
  }
});