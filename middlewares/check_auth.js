const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(' ')[1]
        // console.log(token, authHeader)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json('Token is not valid!')
            }

            req.user = user
            next()
        })
    } else {
        res.status(401).json('You are not authenticated!')
    }
}
