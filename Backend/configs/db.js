require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

console.log("DEBUG URI:", uri); // 👈 check

if (!uri) {
  console.log("❌ MONGO_URI is undefined");
  process.exit(1);
}

const connection = mongoose.connect(uri);

module.exports = connection;
