require('dotenv').config()
const express = require("express")
const app = express()
const port = 3000

// Chemin vers d'autres fichiers .js
require("./mongo")
const { userSignup } = require("./users")

// Middleware
app.use(express.json())

// Routes
app.post("/api/auth/signup", userSignup)
app.get('/', (req, res) => res.send("Hello world"))

// Exécution de backend sur le port 3000
app.listen(port, () => console.log("listening on port" + port))