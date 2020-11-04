const {mongoDB} = require('../../src/app')
const User = require('../../src/models/user')

const userOne = {
  name: "Mike",
  email: "mike@mail.com",
  password: "12345678"
}

const setupDatabase = async () => {
  await mongoDB.connect()
  await User.deleteMany()
  const newUser = await new User(userOne).save()
  await newUser.generateAuthToken()
  userOne.id = newUser.id
  userOne.tokens = newUser.tokens
}

module.exports = {
  userOne,
  setupDatabase
}