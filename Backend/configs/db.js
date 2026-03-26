require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

// Silences the Mongoose 7 DeprecationWarning
mongoose.set('strictQuery', false);

// Connection logic
const connection = mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
