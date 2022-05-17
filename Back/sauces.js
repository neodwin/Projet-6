const jwt = require("jsonwebtoken")

// Verification du token
function getSauces(req, res) {
    const header = req.header("Authorization")

    if (header == null) return res.send(403).send({ message: "Invalide" })

    const token = header.split(" ")[1]
    if (token == null) return res.send(403).send({ message: "Le token ne peut pas être null" })

    jwt.verify(token, process.env.PASSWORD_JWT, (err, decoded) => verifyToken(err, decoded, res))
}

function verifyToken(err, decoded, res) {
    if (err) res.status(403).send({ message: 'Token invalide' + err })
    else {
        res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] })
    }
}

module.exports = { getSauces }