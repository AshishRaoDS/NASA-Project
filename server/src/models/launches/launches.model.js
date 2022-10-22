const launchesDatabase = require('./launches.mongo')
const planets = require("../planets/planets.mongo")

const axios = require('axios');
const { pagination } = require("../../services/query")

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_URL = "https://api.spacexdata.com/v4/launches/query"

const populatingLaunchData = async () => {
  console.log('Loading launch data')

  const spaceEXData = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [{
        path: "rocket",
        select: {
          name: 1
        }
      }, {
        path: "payloads",
        select: {
          customers: 1
        }
      }]
    }
  })

  if (spaceEXData.status !== 200) {
    throw new Error('Error in downloading spaceEx launches data')
  }

  const allSpaceExLaunches = spaceEXData.data.docs
  for (const spaceExLaunch of allSpaceExLaunches) {
    const payload = spaceExLaunch.payloads.flatMap(payload => payload.customers)
    const launch = {
      flightNumber: spaceExLaunch['flight_number'],
      mission: spaceExLaunch.name,
      rocket: spaceExLaunch.rocket.name,
      launchDate: spaceExLaunch['date_local'],
      customer: payload,
      upcoming: spaceExLaunch.upcoming,
      success: spaceExLaunch?.success ? spaceExLaunch.success : false,
    }

    await saveLaunch(launch)
  }

}

async function loadLaunchesData() {

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat"
  })

  if (firstLaunch) {
    return console.log("Launch data already loaded")
  }

  populatingLaunchData()

}



async function saveLaunch(launch) {
  // Find one and update used to instead of updateOne to avoid showing unnecessary 
  // properties like $setOnInsert to the front end
  const updatedLaunch = await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber
  },
    launch,
    {
      upsert: true
    }
  )

  return updatedLaunch
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter)
}

const existsLaunchById = async (id) => {
  return await findLaunch({
    flightNumber: id
  })
}

const getAllLaunches = async (queryParams) => {
  const { skip, limit } = pagination(queryParams)

  return await launchesDatabase.find({}, {
    '_id': 0,
    '__v': 0
  })
    .skip(skip)
    .limit(limit)
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
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if (!planet) {
    return false
  }

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
  existsLaunchById,
  loadLaunchesData
}