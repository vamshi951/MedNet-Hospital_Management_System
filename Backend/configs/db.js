require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

if (!uri) {
  console.log("❌ MONGO_URI is undefined. Check your .env file");
}

const connection = mongoose.connect(uri);

module.exports = connection;
