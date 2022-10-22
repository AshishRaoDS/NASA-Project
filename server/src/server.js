const http = require("http")
const app = require("./app")
const mongoose = require('mongoose')
const { loadPlanetsData } = require("./models/planets/planets.model")
const PORT = process.env.PORT || 8000

const MONGO_URL = 'mongodb+srv://hakoon24:CfK5PYj2LzlMd0w5@cluster1.wkxesxj.mongodb.net/NASA-database?retryWrites=true&w=majority'

const server = http.createServer(app)

mongoose.connection.once("open", () => {
  console.log('Connection was opened')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL)
  await loadPlanetsData()

  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
  })

}

startServer()