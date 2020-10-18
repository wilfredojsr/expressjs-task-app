const request = require('supertest')
const {app, mongoDB} = require('../src/app')

test('Should signup a new user', async () => {
  await mongoDB.connect()
  await request(app).post('/users').send({
    name: 'Wilfredo',
    email: 'wjsr@mail-test.com',
    password: 'wil123!'
  }).expect(201)
})