const { getAllLaunches, addNewLaunch, abortLaunch, existsLaunchById } = require("../../models/launches/launches.model");


function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
  const launch = req.body
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(401).json({
      error: "Required input fields not provided"
    })
  }
  launch.launchDate = new Date(launch.launchDate)

  if (isNaN(launch.launchDate)) {
    return res.status(401).json({
      error: "Invalid date provided"
    })
  }
  addNewLaunch(launch)
  return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
  const launchId = req?.body?.id
  if (!existsLaunchById(launchId)) {
    return res.status(400).json({
      error: "Launch does not exist"
    })
  }

  const launch = abortLaunch(launchId)
  return res.status(201).json(launch)
}


module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}