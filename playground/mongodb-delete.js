const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
  if (error) {
    console.log('Unable to connect to db server');
  } else {
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

  db.collection('Users').deleteMany({name: 'Duplicate User'}).then( ({ result }) => {
    console.log(result);
  });

  db.collection('Users').findOneAndDelete({_id: ObjectID('5acbb44ccd1cdc7ab9555720')})
  .then((result) => {console.log(result); });
  
  client.close();

  }

});