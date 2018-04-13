const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo',
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
  }];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos)
  })
  .then( () => { done(); });
});

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

