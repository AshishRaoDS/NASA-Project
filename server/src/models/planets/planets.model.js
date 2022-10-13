const { parse } = require("csv-parse")
const path = require("path")
const fs = require("fs")


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
          planetsDataArray.push(chunk)
        }
      })
      .on("error", (err) => {
        console.log(err)
        reject(err)
      })
      .on("end", () => {
        console.log(`${planetsDataArray.length} are the number of possible habitable planets found`)
      })
    resolve()
  })
}


module.exports = {
  loadPlanetsData,
  planets: planetsDataArray
}
