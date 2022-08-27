const path = require("path")
const express = require("express")
const hbs = require("hbs")

const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

const app = express()
const PORT = process.env.PORT || 3000

// Define paths for express config
const publicDirPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// Setup handlers engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    title: "Weather App",
    name: "Abhishek",
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Abhishek Rawat",
  })
})

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
    name: "Abhishek Rawat",
    helpText: "Help others to learn more.",
  })
})

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Please provide a address",
    })
  }

  geocode(req.query.address, (error, geocodeData = {}) => {
    const { lat, lon, location } = geocodeData
    if (error) {
      return res.send({
        error,
      })
    }

    forecast(lat, lon, (error, forecastData) => {
      if (error) {
        res.send({
          error,
        })
      }

      res.send({
        forecast: forecastData,
        location,
        address: req.query.address,
      })
    })
  })
})

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search a search term",
    })
  }

  res.send({
    products: [],
  })
})

// Catch all for help 404
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Abhishek",
    errorMessage: "Help article not found",
  })
})

// Catch all 404
app.get("/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Abhishek",
    errorMessage: "Page not found.",
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
