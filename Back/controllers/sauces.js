const mongoose = require("mongoose")
const unlink = require("fs").promises.unlink

const dataProduct = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const Product = mongoose.model("Product", dataProduct)

// Verification du token

function getSauces(req, res) {
    Product.find({})
        .then((products => res.send(products)))
        .catch(error => res.status(500).send(error))
}

function sauceId(req, res) {
    const id = req.params.id
    return Product.findById(id)
}

function getSaucesId(req, res) {
    sauceId(req, res)
        .then(product => statusSent(product, res))
        .catch(((error) => res.status(500).send(error)))
}

// Suppression sauce

function deleteSauces(req, res) {
    const id = req.params.id
    Product.findByIdAndDelete(id)
        .then((product) => statusSent(product, res))
        .then((product) => deleteFile(product))
        .catch((error) => res.status(500).send({ message: error }))
}

// Suppression de l'image

function deleteFile(product) {
    if (product == null) return
    const imageUrl = product.imageUrl
    const imageDelete = imageUrl.split("/").at(-1)
    unlink(`images/${imageDelete}`)
    console.log("IMAGE SUPPRIMEE")
}

// Modification sauce

function modifySauces(req, res) {
    const params = req.params
    const id = params.id

    const hasModifyImage = req.file != null
    const anotherImage = madeAnotherImage(hasModifyImage, req)

    Product.findByIdAndUpdate(id, anotherImage)
        .then((product) => statusSent(product, res))
        .then((product) => deleteFile(product))
        .catch(err => console.error("problème de mise à jour:", err))
}

function madeAnotherImage(hasModifyImage, req) {
    console.log("hasModifyImage:", hasModifyImage)
    if (!hasModifyImage) return req.body
    const anotherImage = JSON.parse(req.body.sauce)
    const fileName = req.file.fileName
    anotherImage.imageUrl = req.protocol + "://" + req.get("host") + "/images/" + fileName;
    return anotherImage
}

// Gestion d'erreur de la base donnée

function statusSent(product, res) {
    if (product == null) {
        console.log("Rien à été mis à jour")
        return res.status(404).send({ message: "Erreur dans la base de donnée" })
    }
    console.log("Tout a été mis à jour:", product)
    return Promise.resolve(res.status(200).send(product))
        .then(() => product)
}

// Création d'une sauce

function madeSauces(req, res) {

    const sauce = JSON.parse(req.body.sauce)

    console.log("sauce:", sauce)
    console.log({ body: req.body.sauce })
    console.log({ file: req.file })
    const fileName = req.file.fileName

    const imageUrl = req.protocol + "://" + req.get("host") + "/images/" + fileName;

    const product = new Product({
        userId: sauce.userId,
        name: sauce.name,
        manufacturer: sauce.manufacturer,
        description: sauce.description,
        mainPepper: sauce.mainPepper,
        imageUrl,
        heat: sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product.save().then((message) => {
            res.status(201).send({ message: message })
            return console.log("produit enregistré", message)
        })
        .catch(console.error)
}

// Gestion like & dislike
function likeSauces(req, res) {
    const like = req.body.like
    const userId = req.body.userId
    if (![0, -1, 1].includes(like)) return res.status(403).send({ message: "BAD REQUEST" })
    sauceId(req, res)
        .then((product) => manageLike(product, like, userId, res))
        .then(pr => pr.save())
        .then(prod => statusSent(prod, res))
        .catch((err) => res.status(500).send(err))
}

function manageLike(product, like, userId, res) {
    if (like === 1 || like === -1) return updateLike(product, like, userId)
    if (like === 0) return resetLike(product, userId, res)
}

function resetLike(product, userId, res) {
    const { usersLiked, usersDisliked } = product
    if ([usersLiked, usersDisliked].every((usersIdArray) => usersIdArray.includes(userId)))
        return Promise.reject("l'utilisateur ne peut pas liker & disliker")
    if (![usersLiked, usersDisliked].some((usersIdArray) => usersIdArray.includes(userId)))
        return Promise.reject("l'utilisateur n'a pas voté")

    usersLiked.includes(userId) ? --product.likes : --product.dislikes

    let updateListUsers = usersLiked.includes(userId) ? usersLiked : usersDisliked
    const filterUser = updateListUsers.filter((id) !== userId)
    updateListUsers = filterUser
    return product
}

function updateLike(product, like, userId) {
    const { usersLiked, usersDisliked } = product

    const likers = like === -1 ? usersLiked : usersDisliked
    if (likers.includes(userId)) return product
    likers.push(userId)

    like === 1 ? ++product.likes : ++product.dislikes
    return product
}

module.exports = { getSauces, madeSauces, getSaucesId, deleteSauces, modifySauces, likeSauces }