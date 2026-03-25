const express = require("express")
const app = express()
const dotenv = require("dotenv").config()
const getDb = require("./config/connectionDb")
const cors = require("cors")

const PORT = process.env.PORT || 3000

// Initialize Database connection on boot
getDb().then(() => {
    console.log("SQLite successfully initialized")
}).catch(err => {
    console.error("Database initialization failed", err)
})

app.use(express.json())
app.use(cors())

app.use("/auth", require("./routes/user"))
app.use("/recipe", require("./routes/recipe"))

app.listen(PORT, (err) => {
    console.log(`app is listening on port ${PORT}`)
})