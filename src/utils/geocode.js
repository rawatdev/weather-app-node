const request = require("postman-request")

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv").config()
}

const geocode = (address, callback) => {
  const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    address
  )}&limit=1&appid=${process.env.API_KEY}`

  request(url, { json: true }, (error, response, body) => {
    if (error) {
      callback("Unable to connect to location services!", undefined)
    } else if (body.length === 0) {
      callback("Unable to find location. Try another search.", undefined)
    } else {
      const { lat, lon, name, state, country } = body[0]
      const location = `${name},${
        name !== state ? ` ${state},` : ""
      } ${country}`

      callback(undefined, { lat, lon, location })
    }
  })
}

module.exports = geocode
