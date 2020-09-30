const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {

  const task = new Task({
    ...req.body,
    owner: req.user,
    ref: 'User'
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }

})

router.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('Task').execPopulate()
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id

  try {

    const task = await Task.findOne({_id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)

  } catch (e) {
    res.status(500).send(e)
  }

})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = [
    'description',
    'completed'
  ]
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }

  try {

    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

    if (!task) {
      return res.status(400).send()
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)

  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

module.exports = router