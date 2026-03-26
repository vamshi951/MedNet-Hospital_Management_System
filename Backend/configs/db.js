const mongoose = require("mongoose");
require("dotenv").config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const connection = mongoose.connect(process.env.dbURL);

module.exports = { connection };
