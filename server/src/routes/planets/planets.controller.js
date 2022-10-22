const { getAllPlanets } = require("../../models/planets/planets.model")

async function httpGetPlanetsHandler(req, res) {
  return res.status(200).json(await getAllPlanets())
}

module.exports = {
  httpGetPlanetsHandler
}