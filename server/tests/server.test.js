const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { populateTodos, pupulateUsers, todos, users } = require('./seed/seed');

beforeEach(pupulateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((error, res) => {
      if (error) {
        return done(error);
      }
      Todo.find({ text: 'Test todo' }).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch(e => { done(e); });
    });
  });

  it('should not create a new todo if invalid value is passed', (done) => {
    request(app)
    .post('/todos')
    // .send({text: ''})
    .send({})
    .expect(400)
    .end((error, res) => {
      if (error) {
        return done(error);
      }
      Todo.find().then(todos => {
        expect(todos.length).toBe(2);
        done();
      }).catch(e => { done(e); });
    });
  });
});

describe('GET/todos', () => {
  it('should return all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET/todos/:id', () => {
  it('should return todo by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect( res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE/todos/:id', () => {
  it('should delete todo by id', (done) => {
    const id = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id)
      })
      .end((err, res) => {
        if (err) return done(err);
        Todo.findById(id)
         .then(todo => {
            expect(todo).toNotExist();
            done();
         })
         .catch(e => { done(e); });
        });
  });

  it('should send empty body and 404 if todo doesn\'t exist', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should send empty body and 404 if id is invalid', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });
});

describe('PATCH/todos/:id', () => {
  it('should update a todo', (done) => {
    const id = todos[0]._id.toHexString();
    const updatedTodo = { text: 'Updated text', completed: true };
    request(app)
      .patch(`/todos/${id}`)
      .send(updatedTodo)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(updatedTodo.text);
        expect(res.body.todo.completed);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        Todo.findById(id).then((todo) => {
          expect(todo.text).toBe(updatedTodo.text);
          expect(todo.completed).toBe(updatedTodo.completed);
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch(e => { done(e); });
      });
  });

  it('should clear completedAt when todo is set as incompleted', (done) => {
    const id = todos[0]._id.toHexString();
    const updatedTodo = { text: 'Updated text', completed: false };
    request(app)
      .patch(`/todos/${id}`)
      .send(updatedTodo)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(updatedTodo.text);
        expect(res.body.todo.completed);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        Todo.findById(id).then((todo) => {
          expect(todo.text).toBe(updatedTodo.text);
          expect(todo.completed).toBe(updatedTodo.completed);
          expect(todo.completedAt).toNotExist();
          done();
        }).catch(e => { done(e); });
      });
  });

});

describe('GET/users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe('POST/users', () => {
  it('should create user', done => {
    const email = 'example@example.com';
    const password = 'abcdefg!';
    request(app)
      .post('/users')
      .send({
        email, password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      // .end(done);
      .end(error => {
        if (error) {
          return done(error);
        }
        User.findOne({ email })
          .then(user => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
          });
          done();

      });
  });

  it('should return validation errors if email is invalid', done => {
    request(app)
      .post('/users')
      .send({ email: 'aaa' })
      .expect(400)
      .end(done);
  });

  it('should return validation errors if passwod is invalid', done => {
    request(app)
      .post('/users')
      .send({ password: '123' })
      .expect(400)
      .end(done);
  });

  it('should not create user if email in use', done => {
    request(app)
      .post('/users')
      .send({ email: users[0].email })
      .expect(400)
      .end(done);
  });
});

describe('POST/users/login', () => {
  it('should login user if email is valid and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({ email: users[1].email, password: users[1].password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        // User.findOne({ email: users[0].email })
        User.findById(users[1]._id)
            .then(user => {
              expect(user.tokens[0]).toInclude({
                'access': 'auth',
                'token': res.headers['x-auth']
              });
              done();
            })
            .catch(e => done(e));
      });
  });

  it('should return 400 if user not found', done => {
    request(app)
      .post('/users/login')
      .send({ email: 'aaa', password: users[0].password })
      .expect(400)
      .end(done);
  });

  it('should return 400 if password is not correct', done => {
    request(app)
      .post('/users/login')
      .send({ email: users[0].email, password: users[0].password + '111' })
      .expect(400)
      .end(done);
  });
});

