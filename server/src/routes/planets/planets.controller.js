const { planets } = require("../../models/planets/planets.model")

function getPlanetsHandler(req, res) {
  return res.status(200).json(planets)
}

module.exports = {
  getPlanetsHandler
}