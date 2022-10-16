const { getAllPlanets } = require("../../models/planets/planets.model")

function httpGetPlanetsHandler(req, res) {
  return res.status(200).json(getAllPlanets())
}

module.exports = {
  httpGetPlanetsHandler
}