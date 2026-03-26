require("dotenv").config({ path: __dirname + "/../.env" });

const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

<<<<<<< HEAD
console.log("DEBUG URI:", uri); // 👈 check

if (!uri) {
  console.log("❌ MONGO_URI is undefined");
=======
if (!uri) {
  console.log("❌ MONGO_URI missing");
>>>>>>> ebd87bc8bda2b5cbcb71370591c8836f1c38b975
  process.exit(1);
}

const connection = mongoose.connect(uri);

module.exports = connection;
