const mongoose = require('mongoose')

//const connectionURL = 'mongodb://<user>:encodeURIComponent('<pass>')@<host>:<port>/<database>?authSource=admin'
const databaseName = 'task-manager'
const connectionURL = 'mongodb://' + process.env.MONGO_DB_W + ':' + encodeURIComponent(process.env.MONGO_DB_X) + '@' + process.env.MONGO_DB_Y + ':' + process.env.MONGO_DB_Z + '/' + databaseName + '?authSource=admin'

mongoose.connect(connectionURL, {
  useUnifiedTopology: true,
  useCreateIndex: true
})
