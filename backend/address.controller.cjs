const express = require("express");
const router = express.Router();

const Address = require("./models/address.model.js");
const auth = require("./middleware.cjs");

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.id;
    if (!userId) {
      return res.status(400).send("User id is required");
    }
    const addresses = await Address.find({ userId: userId });
    if (!addresses) {
      return res.status(404).json({
        message: "No addresses found",
      });
    }
    res
      .json({
        message:
          addresses.length > 0
            ? "Addresses fetched successfully"
            : "No addresses found",
        data: addresses,
        success: true,
      })
      .status(200);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while retrieving addresses.",
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { addressFetched, houseAddress, aparmentAddress, favorite, type } =
      req.body;

    const addressDoc = new Address({
      userId: req.id,
      address: addressFetched,
      houseAddress: houseAddress,
      aparmentAddress: aparmentAddress,
      favorite: favorite,
      type: type,
    });
    const data = await addressDoc.save();
    res.status(201).json({
      message: "Address added successfully",
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while adding the address.",
    });
  }
});

router.put("/fav", auth, async (req, res) => {
  try {
    const { address } = req.body;

    const userId = req.id;
    
    if (!userId && !address) {
      return res.status(400).send("User id and address is required");
    }

    const addressDoc = await Address.findOneAndUpdate(
      { userId: userId, address: address },
      { favorite: true },
      { new: true }
    );

    if (!addressDoc) {
      return res.status(404).json({
        message: `Cannot update Address. Maybe Address was not found!`,
      });
    }
    res.json({
      message: "Address updated successfully",
      success: true,
      data: address,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Some error occurred while updating the address.",
    });
  }
});
module.exports = router;
