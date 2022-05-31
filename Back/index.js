const { app, express } = require("./server")
const { saucesRouter } = require("./routers/sauces.router")
const { authRouter } = require("./routers/auth.router")
const bodyParser = require("body-parser")
const port = 3000
const path = require("path")

// Chemin vers d'autres fichiers .js
require("./mongo")

// Middleware
app.use("/api/sauces", saucesRouter)
app.use("/api/auth", authRouter)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes

app.get('/', (req, res) => res.send("Hello World"))

// Exécution du backend sur le port 3000
app.use("/images", express.static(path.join(__dirname, "images")))
app.listen(port, () => console.log("listening on port" + port))