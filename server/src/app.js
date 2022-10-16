const express = require("express")

const cors = require("cors")

const path = require("path")

const morgan = require("morgan")

const planetRouter = require("./routes/planets/planets.router")
const launchesRouter = require("./routes/launches/launches.router")

const app = express()

app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(morgan("combined"))
app.use(express.json())
app.use(express.static(path.join(__dirname, "..", "public")))
app.use("/planets", planetRouter)
app.use("/launches", launchesRouter)

// That * is important. If the server side routing fails then that star allows for client side routing to take over
// This way /history and /upcoming routes can be handled without it being specified in the server routing
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})


module.exports = app