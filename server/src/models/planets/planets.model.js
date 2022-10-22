const { parse } = require("csv-parse")
const path = require("path")
const fs = require("fs")

const planets = require('./planets.mongo')

const planetsDataArray = []

const isHabitablePlanet = (planet) => {
  return planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 && planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
}


//This is async code
//Hence we need to create a promise and listen to the server only after the data has been resolved

async function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(`${path.join(__dirname, "../../../", "data", "kepler-data.csv")}`)
      .pipe(parse({
        comment: "#",
        columns: true
      }))
      .on("data", (chunk) => {
        if (isHabitablePlanet(chunk)) {
          createAllPlanets(chunk)
        }
      })
      .on("error", (err) => {
        console.log(err)
        reject(err)
      })
      .on("end", async () => {
        const planetsCount = (await getAllPlanets()).length
        console.log(`${planetsCount} are the number of possible habitable planets found`)
      })
    resolve()
  })
}

async function getAllPlanets() {
  //The second argument is passed to avoid returning those fields from that api
  return await planets.find({}, {
    '_id': 0,
    '__v': 0
  })
}

async function createAllPlanets(planet) {
  // Here instead of using create, I am using updateOne so that it doesn't create a document every time this
  // function is called
  try {
    await planets.updateOne({
      keplerName: planet.kepler_name
    }, {
      keplerName: planet.kepler_name
    },
      {
        upsert: true
      })
  } catch (err) {
    console.log(`Something went wrong while updating/creating ${err}`)
  }
}


module.exports = {
  loadPlanetsData,
  getAllPlanets
}
