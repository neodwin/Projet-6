require('dotenv').config()
const express = require("express")
const app = express()
const port = 3000
const bodyParser = require("body-parser")
const multer = require("multer")
const path = require("path")

// Chemin vers d'autres fichiers .js
require("./mongo")
const { userSignup, userLogin } = require("./controllers/users")
const { getSauces, madeSauces } = require("./controllers/sauces")

// Middleware
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const storage = multer.diskStorage({
    destination: "images/",
    filename: function(req, file, cb) {
        cb(null, createFilename(req, file))
    }
})
const upload = multer({ storage: storage })

function createFilename(req, file) {
    console.log("req, file:", file)
    const fileName = `${Date.now()}-${file.originalname}`.replace(/\s/g, "-")
    file.fileName = fileName
    return fileName
}

const { validateUser } = require("./middleware/auth")

// Routes
app.post("/api/auth/signup", userSignup)
app.post("/api/auth/login", userLogin)
app.get("/api/sauces", validateUser, getSauces)
app.post("/api/sauces", validateUser, upload.single("image"), madeSauces)
app.get('/', (req, res) => res.send("Hello World"))

// Exécution de backend sur le port 3000

app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("listening on port" + port))