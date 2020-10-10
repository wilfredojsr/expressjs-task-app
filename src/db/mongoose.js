const mongoose = require('mongoose')

//const connectionURL = 'mongodb://<user>:encodeURIComponent('<pass>')@<host>:<port>/<database>?authSource=admin'
const databaseName = 'task-manager'
const connectionURL = process.env.MONGO_DB_URL

mongoose.connect(connectionURL, {
  useUnifiedTopology: true,
  useCreateIndex: true
})
