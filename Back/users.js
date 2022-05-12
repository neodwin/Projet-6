const user = require("./mongo").user

function userSignup(req, res) {
    const email = req.body.email
    const password = req.body.password

    const user = new user({ email: email, password: password })

    user.save()
        .then(() => res.send({ message: "utilisateur enregistré" }))
        .catch((err) => console.log("User non enregistré", err))
}

module.exports = { userSignup }