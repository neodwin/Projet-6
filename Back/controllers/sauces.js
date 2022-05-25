const mongoose = require("mongoose")

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

module.exports = { getSauces, madeSauces, getSaucesId }