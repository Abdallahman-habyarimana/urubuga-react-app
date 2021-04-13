const express = require("express")
const app  = express();

const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')
const colors = require('colors')

dotenv.config()

mongoose.connect('mongodb://localhost/urubuga', { useNewUrlParser: true, useUnifiedTopology: true}).then(
    console.log("The database is successful connected".red.underline.italic.bold)
)

app.use(express.json())
app.use(helmet())
app.use(morgan("common"));

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Currently the Server is running on ${PORT}`.cyan.underline.bold)
})