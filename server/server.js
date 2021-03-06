const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const { Todo } = require('./models/todo.js');
const { User } = require('./models/user.js');
const { authenticate } = require('./middleware/authenticate');

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 9000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 9000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} 

// for production 
// PORT is set by heroku
// MONGODB_URI was set on heroku repo configuration
// db created manually on mLab 
// available at mongodb://nata-ivanova:3449nat_ml@ds241699.mlab.com:41699/todos-app 


const { mongoose } = require('./db/mongoose.js');

const app = express();

const port = process.env.PORT;

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
        res.send({ todo });
      } else res.status(404).send({});
    }, er => {
      res.status(400).send();
    }
  )
  .catch(() => { res.status(400).send(); });
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  if (!ObjectID.isValid(id)) {
    res.send(404);
    return;
  }
  Todo.findByIdAndRemove(id)
    .then(todo => {
      if (!todo) {
        res.status(404).send();
        return
      }
      res.send({ todo });
    })
    .catch((e) => {
      res.status(404).send();
    });
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    res.status(404).send();
    return;
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  })
    .then(todo => {
      if (!todo) {
        res.status(404).send();
        return;
      }
      res.send({ todo });
    }, error => {
      res.status(400).send();
    });
});

app.post('/users', (req, res) => {
  const userData = _.pick(req.body, ['email', 'password']);
  const user = new User(userData);
  user.save().then(user => user.generateAuthToken())
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      res.status(400).send(err);
    })
});

app.post('/users/login', (req, res) => {
  const userData = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(userData.email, userData.password)
    .then(user => {
      user.generateAuthToken()
        .then(token => {
          res.header('x-auth', token)
            .send(user);
        });
    })
    .catch((e) => {
      //console.log(e);
      res.status(400).send(e);
    })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token)
    .then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    })
});

module.exports = { app };