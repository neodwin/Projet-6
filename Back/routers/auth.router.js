const express = require("express")
const { userSignup, userLogin } = require("../controllers/users")
const authRouter = express.Router()

// Route du fichier auth.js
authRouter.post("/signup", userSignup)
authRouter.post("/login", userLogin)

module.exports = { authRouter }