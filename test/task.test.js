const request = require('supertest')
const {app} = require('../src/app')
const Task = require('../src/models/task')
const {
  userOne,
  userTwo,
  taskOne,
  setupDatabase
} = require('./fixtures/db')

describe('Tasks', () => {

  beforeAll(setupDatabase)

  it('Should create task for user', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: 'From my test',
        owner: userOne
      })
      .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
  })

  it('Should fetch user tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
    expect(response.body.length).toEqual(3)
  })

  it('Should not delete other users tasks', async () => {
    const response = await request(app)
      .delete(`/tasks/${taskOne.id}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(404)
    const task = await Task.findById(taskOne.id)
    expect(task).not.toBeNull()
  })

})