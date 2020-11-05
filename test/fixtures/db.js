const {mongoDB} = require('../../src/app')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOne = {
  name: "Mike",
  email: "mike@mail.com",
  password: "12345678"
}

const userTwo = {
  name: "Mike2",
  email: "mike2@mail.com",
  password: "12345678"
}

const taskOne = {
  description: 'First Task',
  completed: false
}

const taskTwo = {
  description: 'Second Task',
  completed: true
}

const taskThree = {
  description: 'Three Task',
  completed: true
}

const createUser = async (user) => {
  const newUser = await new User(user).save()
  await newUser.generateAuthToken()
  user.id = newUser.id
  user.tokens = newUser.tokens
}

const createTask = async (task, user) => {
  task.owner = user.id
  const newTask = await new Task(task).save()
  task.id = newTask.id
}

const setupDatabase = async () => {
  await mongoDB.connect()
  await User.deleteMany()
  await Task.deleteMany()
  await createUser(userOne)
  await createUser(userTwo)
  await createTask(taskOne, userOne)
  await createTask(taskTwo, userOne)
  await createTask(taskThree, userTwo)
}

module.exports = {
  userOne,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase
}