const { getAllLaunches, addNewLaunch } = require("../../models/launches/launches.model");


function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches())
}

function httpAddNewLaunch(req, res) {
  const launch = req.body
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.destination
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


module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch
}