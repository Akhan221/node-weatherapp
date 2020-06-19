const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(path.join(__dirname, '../public'))

const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Andrew Mead'
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })

    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            return res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })

    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Andrew Mead'
    })
})



app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})

