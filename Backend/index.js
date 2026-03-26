require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const connection = require("./configs/db");

const app = express();
app.use(express.json());
app.use(cors());

// Hardcoded fallback to 5000 if process.env.PORT is missing
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("Backend working"));

app.listen(PORT, async () => {
    try {
        await connection;
        console.log("✅ Connected to DB");
    } catch (err) {
        console.log("❌ Connection failed", err);
    }
    // Using a template literal to ensure the port is printed
    console.log(`🚀 Listening at port: ${PORT}`);
});
