const expect = require('expect');
const request = require('supertest');
const { app } = require('./../server');
const { Todo } = require('./../models/todo');

beforeEach((done) => {
  Todo.remove({}).then(() => {
    done();
  });
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
      Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        done();
      }).catch(e => { done(e); });
    });
  });
});

