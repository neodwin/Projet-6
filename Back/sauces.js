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

    Product.find({}).then((products => res.send(products)))
        // res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] })
}

function madeSauces(req, res) {

    const sauce = JSON.parse(req.body.sauce)
    const name = sauce.name
    const manufacturer = sauce.manufacturer
    const description = sauce.description
    const mainPepper = sauce.mainPepper
    const heat = sauce.heat
    const userId = sauce.userId

    console.log("sauce:", sauce)
    console.log({ body: req.body.sauce })
    console.log({ file: req.file })
    const fileName = req.file.fileName


    const product = new Product({
        userId,
        name,
        manufacturer,
        mainPepper,
        imageUrl: req.protocol + "://" + req.get("host") + "/images/" + fileName,
        heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    product.save().then((res) => console.log("produit enregistré", res)).catch(console.error)
}

module.exports = { getSauces, madeSauces }