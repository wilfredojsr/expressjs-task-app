const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {

    if (!req.header('Authorization')) {
      return res.status(401).send({error: 'Please authenticate.'})
    }

    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.SECRET_JWT)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

    if (!user) {
      return res.status(401).send({error: 'Please authenticate.'})
    }

    req.token = token
    req.user = user
    next()

  } catch (e) {
    res.status(500).send({error: 'Please authenticate.'})
  }
}

module.exports = auth