const mongoose = require("mongoose")
const unlink = require("fs").promises.unlink

// Création d'un schéma de données Mongoose
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

// Fonction d'appel des sauces
function getSauces(req, res) {
    Product.find({})
        .then((products) => res.send(products))
        .catch((error) => res.status(500).send(error))
}

//Fonction d'id unique de sauce
function sauceId(req, res) {
    const id = req.params.id
    return Product.findById(id)
}

function getSaucesId(req, res) {
    sauceId(req, res)
        .then((product) => statusSent(product, res))
        .catch((error) => res.status(500).send(error))
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
        .catch((err) => console.error("problème de mise à jour:", err))
}
// Fonction de modification de l'image
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

// Fonction d'appel du produit
function likeSauces(req, res) {
    const like = req.body.like
    const userId = req.body.userId
    if (![1, -1, 0].includes(like)) return res.status(403).send({ message: "Invalid like value" })
    sauceId(req, res)
        .then((product) => updateLike(product, like, userId, res))
        .then((product) => product.save())
        .then((product) => statusSent(product, res))
        .catch((err) => res.status(500).send(err))
}

// Fonction d'ajout d'un like ou dislike
function updateLike(product, like, userId, res) {
    if (like === 1 || like === -1) return modifyLike(product, userId, like)
    return resetLike(product, userId, res)
}

// Fonction de gestion d'erreur du like ou dislike
function resetLike(product, userId, res) {
    const usersLiked = product.usersLiked
    const usersDisliked = product.usersDisliked
    if ([usersLiked, usersDisliked].every((array) => array.includes(userId)))
        return Promise.reject("Error")
    if (![usersLiked, usersDisliked].some((array) => array.includes(userId)))
        return Promise.reject("Error")
    if (usersLiked.includes(userId)) {
        --product.likes
        product.usersLiked = product.usersLiked.filter((id) => id !== userId)
    } else {
        --product.dislikes
        product.usersDisliked = product.usersDisliked.filter((id) => id !== userId)
    }
    return product
}

// Fonction d'ajout du userId dans le usersLiked ou usersDisliked
function modifyLike(product, userId, like) {
    const usersLiked = product.usersLiked
    const usersDisliked = product.usersDisliked
    const likersList = like === 1 ? usersLiked : usersDisliked
    if (likersList.includes(userId)) return product
    likersList.push(userId)
    like === 1 ? ++product.likes : ++product.dislikes
    return product
}

module.exports = { getSauces, madeSauces, getSaucesId, deleteSauces, modifySauces, likeSauces }