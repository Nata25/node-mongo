const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
    console.log('Unable to connect to db server');
  } else {
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    db.collection('Todos').find().toArray().then(result => {
      console.log('All todos:', result);
    }, error => { console.log('unable to fetch todos'); });

    db.collection('Users').find({name: 'Natalie'}).count().then((count) => {
      console.log('Count:', count);
    }, error => { console.log('unable to fetch todos'); }
  );

  client.close();

  }

});