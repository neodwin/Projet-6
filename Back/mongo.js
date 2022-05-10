// Base de données
const mongoose = require('mongoose');
const uri = "mongodb+srv://edervaux:<youshallnotpass>@cluster0.gwipg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri).then((() => console.log("connected to mongo"))).catch(err => console.error("Error connecting to Mongo: ", err))