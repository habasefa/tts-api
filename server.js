require('dotenv').config()

const http = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { success } = require('./lib/chalkLog')

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

// route imports
const userRoutes = require('./routes/user')
const tutorRoutes = require('./routes/tutor')
const parentRoutes = require('./routes/parent')
const studentRoutes = require('./routes/student')
const reportRoutes = require('./routes/report')
const jobRoutes = require('./routes/job')
const adminRoutes = require('./routes/admin')
const botRoutes = require('./routes/bot')
const renewAccessTokenRoute = require('./routes/renewAccessToken')

// prisma instance
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// route middlewares
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/tutor', tutorRoutes)
app.use('/api/v1/parent', parentRoutes)
app.use('/api/v1/student', studentRoutes)
app.use('/api/v1/report', reportRoutes)
app.use('/api/v1/job', jobRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/bot', botRoutes)
app.use('/api/v1/refreshTokens', renewAccessTokenRoute)

// catching error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message,
        },
    })
})

// keep server alive
const minInterval = 5 * 60 * 1000 // 5 minutes in milliseconds
const maxInterval = 15 * 60 * 1000 // 15 minutes in milliseconds

function getRandomInterval() {
    return Math.floor(
        Math.random() * (maxInterval - minInterval + 1) + minInterval
    )
}

function keepServerAlive() {
    let count = 0
    console.log('Calling server to keep it alive...')
    http.get('https://temaribet-api.onrender.com')
    count++

    const interval = getRandomInterval()
    setTimeout(keepServerAlive, interval)
}

// listen to server
app.listen(port, () => {
    success(`Server is running on port ${port}.`)
    // keepServerAlive()
})
