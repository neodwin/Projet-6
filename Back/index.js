require('dotenv').config()
const express = require("express")
const app = express()
const port = 3000

// Chemin vers d'autres fichiers .js
require("./mongo")
const { userSignup, userLogin } = require("./users")
const { getSauces } = require("./sauces")

// Middleware
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

// Routes
app.post("/api/auth/signup", userSignup)
app.post("/api/auth/login", userLogin)
app.get("/api/sauces", getSauces)
app.get('/', (req, res) => res.send("Hello World"))

// Exécution de backend sur le port 3000
app.listen(port, () => console.log("listening on port" + port))