const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Account = require("./models/account.model.js");

router.post("/login", async (req, res) => {
  try {
    const { email, pic, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }
    const password = email + process.env.JWT_SECRET + name;

    const account = await Account.findOne({
      email: email,
      password: password,
    });

    if (!account) {
      const newAccount = new Account({
        email: email,
        password: password,
        pic: pic,
        name: name,
      });

      //   Generate token
      const token = jwt.sign(
        { id: newAccount._id, email: newAccount.email },
        process.env.JWT_SECRET
      );

      const data = await newAccount.save();
      return res.status(201).json({
        message: "Account created successfully",
        success: true,
        data: data,
        token: token,
      });
    }

    if (account) {
      // Generate token
      const token = jwt.sign(
        { id: account._id, email: account.email },
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        message: "Login successful",
        success: true,
        data: account,
        token: token,
      });
    } else {
      return res.status(404).json({
        message: "Invalid email or password",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while logging in.",
    });
  }
});

module.exports = router;
