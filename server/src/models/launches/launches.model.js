const launchesDatabase = require('./launches.mongo')
const planets = require("../planets/planets.mongo")

const launches = new Map()

const DEFAULT_FLIGHT_NUMBER = 100;

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date('December 27, 2030'),
  target: "Kepler-1410 b",
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
}

// launches.set(launch.flightNumber, launch)



async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if (!planet) {
    throw new Error("No such planet was found")
  }

  // Find one and update used to instead of updateOne to avoid showing unnecessary 
  // properties like $setOnInsert to the front end
  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber
  },
    launch,
    {
      upsert: true
    }
  )
}

saveLaunch(launch)

const existsLaunchById = async (id) => {
  return await launchesDatabase.findOne({
    flightNumber: id
  })
}

const getAllLaunches = async () => {
  return await launchesDatabase.find({}, {
    '_id': 0,
    '__v': 0
  })
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne()
    .sort("-flightNumber")

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }

  return latestLaunch.flightNumber
}

async function saveNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcoming: true,
    customer: ['ZTM', 'NASA']
  })

  await saveLaunch(newLaunch)

  console.log('yy', newLaunch)
  return newLaunch
}

// function abortLaunch(id) {
//   const launch = launches.get(id)
//   launch.upcoming = false
//   launch.success = false
//   return launch
// }

async function abortLaunch(id) {


  const deletedLaunch = await launchesDatabase.updateOne({
    flightNumber: id
  }, {
    upcoming: false,
    success: false
  })

  return deletedLaunch.acknowledged && deletedLaunch.modifiedCount === 1
}

module.exports = {
  getAllLaunches,
  abortLaunch,
  saveNewLaunch,
  existsLaunchById
}