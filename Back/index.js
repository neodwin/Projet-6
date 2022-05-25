const { app, express } = require("./server")
const bodyParser = require("body-parser")
const port = 3000
const path = require("path")

// Chemin vers d'autres fichiers .js
require("./mongo")
const { userSignup, userLogin } = require("./controllers/users")
const { getSauces, madeSauces, getSaucesId } = require("./controllers/sauces")

// Middleware
const { upload } = require("./middleware/multer")

const { validateUser } = require("./middleware/auth")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.post("/api/auth/signup", userSignup)
app.post("/api/auth/login", userLogin)
app.get("/api/sauces", validateUser, getSauces)
app.post("/api/sauces", validateUser, upload.single("image"), madeSauces)
app.get("/api/sauces/:id", validateUser, getSaucesId)
app.get('/', (req, res) => res.send("Hello World"))

// Exécution de backend sur le port 3000
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("listening on port" + port))