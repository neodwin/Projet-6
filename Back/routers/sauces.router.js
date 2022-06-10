const express = require("express")
const { getSauces, madeSauces, getSaucesId, deleteSauces, modifySauces, likeSauces } = require("../controllers/sauces")
const { upload } = require("../middleware/multer")
const { validateUser } = require("../middleware/auth")
const saucesRouter = express.Router()

// Route du fichier sauce.js
saucesRouter.get("/", validateUser, getSauces)
saucesRouter.post("/", validateUser, upload.single("image"), madeSauces)
saucesRouter.get("/:id", validateUser, getSaucesId)
saucesRouter.delete("/:id", validateUser, deleteSauces)
saucesRouter.put("/:id", validateUser, upload.single("image"), modifySauces)
saucesRouter.post("/:id/like", validateUser, likeSauces)

module.exports = { saucesRouter }