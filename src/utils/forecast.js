const request = require("postman-request")

if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv").config()
}

const capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const forecast = (lat, lon, callback) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_KEY}`

  request(url, { json: true }, (error, response, body) => {
    if (error) {
      callback("Unable to connect to weather service", undefined)
    } else if (body.message) {
      callback("Unable to find location", undefined)
    } else {
      const {
        temp,
        temp_min,
        temp_max,
        humidity,
        feels_like: feelsLike,
      } = body.main
      const description = capitalizeWord(body.weather[0].description)

      callback(
        undefined,
        `${description}. It is currently ${temp} degrees out. It feels like ${feelsLike} degrees out. The today high is ${temp_max} with a low of ${temp_min}. The humidity is ${humidity}%.`
      )
    }
  })
}

module.exports = forecast
