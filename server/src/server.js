const http = require("http")
const app = require("./app")
const { loadPlanetsData } = require("./models/planets/planets.model")
const { mongooseConnect } = require('./services/mongo')
const PORT = process.env.PORT || 8000


const server = http.createServer(app)


async function startServer() {
  await mongooseConnect()
  await loadPlanetsData()

  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`)
  })

}

startServer()