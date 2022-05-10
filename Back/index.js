console.log("Hello world")

const express = require("express")
const app = express()
const port = 3000


// Middleware

app.use(express.json())


// Routes

app.post("/api/auth/signup", (req, res) => {
    console.log("signup request:", req.body)
    res.send({ message: "utilisateur enregistré" })
})

app.get('/', (req, res) => res.send("Hello world"))

app.listen(port, () => console.log("listening on port" + port))