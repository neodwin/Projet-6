   // Base de données
   const mongoose = require('mongoose');
   const password = process.env.PASSWORD_MONGO
   const username = process.env.USER_MONGO

   console.log("password: ", process.env.PASSWORD_MONGO)
   console.log("username: ", process.env.USER_MONGO)

   const uri = "mongodb+srv://${password}:${username}@cluster0.gwipg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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