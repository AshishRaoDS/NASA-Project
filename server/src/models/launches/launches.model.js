const launches = new Map()

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date('December 27, 2030'),
  target: "Kepler-422 b",
  customer: ['ZTM', 'NASA'],
  upcoming: true,
  success: true,
}

launches.set(launch.flightNumber, launch)

const existsLaunchById = (id) => {
  return launches.has(id)
}

const getAllLaunches = () => {
  return Array.from(launches.values())
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      success: true,
      upcoming: true,
      customer: ['ZTM', 'NASA']
    })
  )
}

function abortLaunch(id) {
  const launch = launches.get(id)
  launch.upcoming = false
  launch.success = false
  return launch
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  existsLaunchById
}