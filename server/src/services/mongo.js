const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://hakoon24:CfK5PYj2LzlMd0w5@cluster1.wkxesxj.mongodb.net/NASA-database?retryWrites=true&w=majority'

mongoose.connection.once("open", () => {
  console.log('Connection was opened')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function mongooseConnect() {
  await mongoose.connect(MONGO_URL)
}

async function mongooseDisconnect() {
  await mongoose.disconnect()
}

module.exports = {
  mongooseConnect,
  mongooseDisconnect
}
