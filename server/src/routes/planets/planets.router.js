const express = require("express")

const planetRouter = express.Router()

const { getPlanetsHandler } = require("./planets.controller")

planetRouter.get("/planets", getPlanetsHandler)

module.exports = planetRouter