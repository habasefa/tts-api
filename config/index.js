require('dotenv').config()

module.exports = {
    PORT: process.env.PORT,
    SECRET: process.env.ACCESS_TOKEN_SECRET,
}
