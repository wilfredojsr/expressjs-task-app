const request = require('supertest')
const {app, mongoDB} = require('../src/app')
const User = require('../src/models/user')

const userOne = {
  name: "Mike",
  email: "mike@mail.com",
  password: "12345678"
}

beforeAll(async () => {
  await mongoDB.connect()
  await User.deleteMany()
  const newUser = await new User(userOne).save()
  await newUser.generateAuthToken()
  userOne.id = newUser.id
  userOne.tokens = newUser.tokens
})

afterEach(() => {
  //console.log('afterEach')
})

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Wilfredo',
    email: 'wjsr@mail-test.com',
    password: 'wil123!'
  }).expect(201)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body.user.name).toBe('Wilfredo')

  expect(response.body).toMatchObject({
    user: {
      name: 'Wilfredo',
      email: 'wjsr@mail-test.com'
    }
  })

  expect(user.password).not.toBe('wil123!')
})

test('Should login existing user', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)
})

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'bademail@email.com',
    password: 'badpassword!!'
  }).expect(400)
})

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

  const user = await User.findById(userOne.id)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})