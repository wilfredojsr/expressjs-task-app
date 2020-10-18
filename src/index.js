const {app, mongoDB} = require('./app')
const port = process.env.PORT || 3000

mongoDB.connect()

app.listen(port, () => {
  console.log('Server is up on port ' + port)
})