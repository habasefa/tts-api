const jwt = require('jsonwebtoken')

const createAccessToken = (payload) => {
    console.log(payload)
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d',
    })
}

const createViewToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
}

const decodeToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}
module.exports = {
    createAccessToken,
    createRefreshToken,
    createViewToken,
    decodeToken,
}
