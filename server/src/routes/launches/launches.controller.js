const { getAllLaunches, abortLaunch, existsLaunchById, saveNewLaunch } = require("../../models/launches/launches.model");


async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches())
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body
  console.log(launch)
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
  const newLaunchResponse = await saveNewLaunch(launch)
  if (newLaunchResponse) {
    return res.status(201).json(newLaunchResponse)
  } else {
    return res.status(400).json({
      error: 'Launch could not be added'
    })
  }
}

async function httpAbortLaunch(req, res) {
  const launchId = req?.body?.id
  const existsLaunch = await existsLaunchById(launchId)
  if (!existsLaunch) {
    return res.status(404).json({
      error: "Launch does not exist"
    })
  }

  const launchSuccess = await abortLaunch(launchId)

  if (!launchSuccess) {
    return res.status(400).json({
      error: 'Launch not aborted'
    })
  } else {
    return res.status(201).json(existsLaunch)
  }

}


module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch
}