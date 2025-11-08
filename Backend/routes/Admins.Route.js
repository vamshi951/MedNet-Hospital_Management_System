const express = require("express");
const { AdminModel } = require("../models/Admin.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { NurseModel } = require("../models/Nurse.model");
const { DoctorModel } = require("../models/Doctor.model");
const { PatientModel } = require("../models/Patient.model");

const router = express.Router();

// Get all admins
router.get("/", async (req, res) => {
  try {
    const admins = await AdminModel.find();
    res.status(200).send(admins);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong" });
  }
});

// Register new admin
router.post("/register", async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await AdminModel.findOne({ email });
    if (admin) {
      return res.send({
        message: "Admin already exists",
      });
    }
    let value = new AdminModel(req.body);
    await value.save();
    const data = await AdminModel.findOne({ email });
    return res.send({ data, message: "Registered" });
  } catch (error) {
    res.send({ message: "error" });
  }
});

// Admin login (fixed field name here)
router.post("/login", async (req, res) => {
  const { adminID, password } = req.body;
  //console.log("Login attempt with:", adminID, password);

  try {
    const admin = await AdminModel.findOne({
      admin: String(adminID).trim(), // ✅ match your DB field name
      password: String(password).trim()
    });

    if (admin) {
      const token = jwt.sign({ foo: "bar" }, process.env.key, {
        expiresIn: "24h",
      });
      return res.send({ message: "Successful", user: admin, token });
    } else {
      console.log("No match found for given credentials");
      return res.send({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).send({ message: "Server error" });
  }
});

// Update admin
router.patch("/:adminId", async (req, res) => {
  const id = req.params.adminId;
  const payload = req.body;
  try {
    const admin = await AdminModel.findByIdAndUpdate({ _id: id }, payload);
    if (!admin) {
      res.status(404).send({ msg: `Admin with id ${id} not found` });
    }
    res.status(200).send(`Admin with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

// Delete admin
router.delete("/:adminId", async (req, res) => {
  const id = req.params.adminId;
  try {
    const admin = await AdminModel.findByIdAndDelete({ _id: id });
    if (!admin) {
      res.status(404).send({ msg: `Admin with id ${id} not found` });
    }
    res.status(200).send(`Admin with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

// Send password to email (manually)
router.post("/password", (req, res) => {
  const { email, userId, password } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "agrawaljoy1@gmail.com",
      pass: "zxkyjqfuhiizmxrg",
    },
  });

  const mailOptions = {
    from: "agrawaljoy1@gmail.com",
    to: email,
    subject: "Account ID and Password",
    text: `This is your User Id : ${userId} and Password : ${password} .`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.send(error);
    }
    return res.send("Password reset email sent");
  });
});

// Forgot password route
router.post("/forgot", async (req, res) => {
  const { email, type } = req.body;
  let user;
  let userId;
  let password;

  if (type === "nurse") {
    user = await NurseModel.find({ email });
    userId = user[0]?.nurseID;
    password = user[0]?.password;
  }
  if (type === "patient") {
    user = await PatientModel.find({ email });
    userId = user[0]?.nurseID;
    password = user[0]?.password;
  }
  if (type === "admin") {
    user = await AdminModel.find({ email });
    userId = user[0]?.admin;
    password = user[0]?.password;
  }
  if (type === "doctor") {
    user = await DoctorModel.find({ email });
    userId = user[0]?.docID;
    password = user[0]?.password;
  }

  if (!user || user.length === 0) {
    return res.send({ message: "User not found" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "shivatejk12@gmail.com",
      pass: "zxkyjqfuhiizmxrg",
    },
  });

  const mailOptions = {
    from: "shivatejk12@gmail.com",
    to: email,
    subject: "Account ID and Password",
    text: `This is your User Id : ${userId} and Password : ${password} .`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.send(error);
    }
    return res.send("Password reset email sent");
  });
});

module.exports = router;
