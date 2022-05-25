const User = require("../mongo").user
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Création signup
async function userSignup(req, res) {
    const email = req.body.email
    const password = req.body.password

    const passwordHashing = await passwordHash(password)

    const user = new User({ email: email, password: passwordHashing })
    user.save()
        .then(() => res.status(201).send({ message: "utilisateur enregistré" }))
        .catch((err) => res.status(409).send({ message: "Utilisateur non enregistré :" + err }))
}

// Hachage des mots de passe
function passwordHash(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
}

// Gestion du login
async function userLogin(req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(403).send({ message: "Utilisateur pas ok" })
        }
        const token = makingToken(email)

        const passwordOk = await bcrypt.compare(password, user.password)
        if (!passwordOk) {
            res.status(403).send({ message: "Mot de passe incorrect" })
        }
        if (passwordOk) {
            res.status(200).send({ userId: user._id, token: token })
        }



    } catch (err) {
        console.error(err)
        res.status(500).send({ message: "Erreur interne" })
    }
}

// Création des tokens
function makingToken(email) {
    const passwordJwt = process.env.PASSWORD_JWT
    const token = jwt.sign({ email: email }, passwordJwt, { expiresIn: "24h" })
    return token
}

module.exports = { userSignup, userLogin }