const jwt = require('jsonwebtoken')
require('dotenv').config()
const secretToken = process.env.JWT_SECRET_TOKEN
function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
    }, secretToken)
}
function getUser(token) {
    if (!token) return null
    try {
        return jwt.verify(token, secretToken)
    } catch (err) {
        return null
    }
}
module.exports = {
    setUser,
    getUser,

}