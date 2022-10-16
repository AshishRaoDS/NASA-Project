const express = require("express")

const planetRouter = express.Router()

const { httpGetPlanetsHandler } = require("./planets.controller")

planetRouter.get("/", httpGetPlanetsHandler)

module.exports = planetRouter