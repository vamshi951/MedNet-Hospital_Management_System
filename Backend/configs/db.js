require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

// Fix for the Mongoose DeprecationWarning
mongoose.set('strictQuery', false);

// Using the URI from your .env file
const connection = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
