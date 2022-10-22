const http = require("http")
require('dotenv').config()

const app = require("./app")
const { loadPlanetsData } = require("./models/planets/planets.model")
const { loadLaunchesData } = require('./models/launches/launches.model')
const { mongooseConnect } = require('./services/mongo')
const PORT = process.env.PORT || 8000


const server = http.createServer(app)


async function startServer() {
  await mongooseConnect()
  await loadPlanetsData()
  await loadLaunchesData()

  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
  })

}

startServer()