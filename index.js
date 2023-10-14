require('dotenv').config()
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const app = express()
const PORT = process.env.PORT || 8000
const MONGO_URI = process.env.MONGO_URI
const URL = require('./models/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const urlRoute = require('./routes/url')

const { restrictToLoggedInUserOnly, checkAuth } = require('./middlewares/auth')

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

const { connectToMongoDB } = require('./connection.js')
// connect to mongodb
connectToMongoDB(MONGO_URI).then(console.log('Connected to MongoDB'))
// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Routes
app.use("/", staticRoute)
app.use('/api', urlRoute)
app.use('/user', userRoute)

app.get("/url/:shortId", async (req, res) => {
    if (req.params) {
        const shortId = req.params.shortId
        if (shortId) {
            const entry = await URL.findOneAndUpdate({
                shortId
            }, {
                $push: {
                    visitHistory: {
                        timestamps: Date.now()
                    },
                }
            })
            res.redirect(entry.redirectURL)
        }
    }
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`)
})
