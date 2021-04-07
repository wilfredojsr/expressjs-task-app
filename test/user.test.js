const request = require('supertest')
const {app} = require('../src/app')
const {userOne, setupDatabase, closeDatabase} = require('./fixtures/db')
const User = require('../src/models/user')

describe('User', () => {

  beforeAll(setupDatabase)
  afterAll(closeDatabase)

  it('Should signup a new user', async () => {
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

  it('Should login existing user', async () => {
    await request(app).post('/users/login').send({
      email: userOne.email,
      password: userOne.password
    }).expect(200)
  })

  it('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
      email: 'bademail@email.com',
      password: 'badpassword!!'
    }).expect(400)
  })

  it('Should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)
  })

  it('Should not get profile for unauthenticated user', async () => {
    await request(app)
      .get('/users/me')
      .send()
      .expect(401)
  })

  it('Should not delete account for unauthenticated user', async () => {
    await request(app)
      .delete('/users/me')
      .send()
      .expect(401)
  })

  it('Should upload avatar image', async () => {
    await request(app)
      .post('/users/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'test/fixture/profile-pic.jpg')
      .expect(200)

    const user = await User.findById(userOne.id)
    expect(user.avatar).toEqual(expect.any(Buffer))
  })

  it('Should update valid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'Jess'
      })
      .expect(200)

    const user = await User.findById(userOne.id)
    expect(user.name).toEqual('Jess')
  })

  it('Should not update invalid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'Philadelphia'
      })
      .expect(400)
  })

  it('Should delete account for user', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200)

    const user = await User.findById(userOne.id)
    expect(user).toBeNull()
  })
})