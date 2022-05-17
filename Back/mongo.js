   // Base de données
   const mongoose = require('mongoose')

   // Framework de verification d'email unique
   const uniqueValidator = require('mongoose-unique-validator')

   // Variables d'environnements
   const password = process.env.PASSWORD_MONGO
   const username = process.env.USER_MONGO
   const baseName = process.env.NAME_MONGO

   const uri = `mongodb+srv://${username}:${password}@cluster0.gwipg.mongodb.net/${baseName}?retryWrites=true&w=majority`

   mongoose
       .connect(uri)
       .then(() => console.log("connected to mongo"))
       .catch(err => console.error("Error connecting to Mongo: ", err))

   const userSchema = new mongoose.Schema({
       email: {
           type: String,
           required: true,
           unique: true
       },
       password: {
           type: String,
           required: true
       }
   })
   userSchema.plugin(uniqueValidator)

   const user = mongoose.model("user", userSchema)

   module.exports = { mongoose, user }