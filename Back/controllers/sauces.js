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

function getSaucesId(req, res) {
    const id = req.params.id
    Product.findById(id)
        .then(product => res.send(product))
        .catch(error => res.status(500).send(error))
}

// Suppression sauce

function deleteSauces(req, res) {
    const id = req.params.id
    Product.findByIdAndDelete(id)
        .then(deleteFile)
        .then((product) => statusSent({ message: product }))
        .catch((error) => res.status(500).send({ message: error }))
}

// Suppression de l'image

function deleteFile(product) {
    const imageUrl = product.imageUrl
    const imageDelete = imageUrl.split("/").at(-1)
    return unlink(`images/${imageDelete}`).then(() => product)
}

// Modification sauce

function modifySauces(req, res) {
    const params = req.params
    const id = params.id

    const hasModifyImage = req.file != null
    const anotherImage = madeAnotherImage(hasModifyImage, req)

    Product.findByIdAndUpdate(id, anotherImage)
        .then((product) => statusSent(product, res))
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
    } else {
        console.log("Tout a été mis à jour:", product)
        res.status(200).send({ message: "Mis à jour avec succès" })
    }
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

module.exports = { getSauces, madeSauces, getSaucesId, deleteSauces, modifySauces }