   // Base de données
   const mongoose = require('mongoose')

   // Variables d'environnements 
   const password = process.env.PASSWORD_MONGO
   const username = process.env.USER_MONGO
   const baseName = process.env.MONGO_NAME

   const uri = `mongodb+srv://${username}:${password}@cluster0.gwipg.mongodb.net/${baseName}?retryWrites=true&w=majority`

   mongoose
       .connect(uri)
       .then(() => console.log("connected to mongo"))
       .catch(err => console.error("Error connecting to Mongo: ", err))

   const userSchema = new mongoose.Schema({
       email: String,
       password: String
   })

   const user = mongoose.model("user", userSchema)

   module.exports = { mongoose, user }