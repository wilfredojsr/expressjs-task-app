const mongoose = require('mongoose')

//const connectionURL = 'mongodb://<user>:encodeURIComponent('<pass>')@<host>:<port>/<database>?authSource=admin'
const connectionURL = process.env.MONGO_DB_URL

const mongoDB = {
  disconnect: async () => {
    return await mongoose.disconnect()
  },
  connect: async () => {
    return await mongoose.connect(connectionURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  }
}

module.exports = mongoDB