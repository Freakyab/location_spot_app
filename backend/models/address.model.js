const mongoose = require("mongoose");
const client = require("../config");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    houseAddress: {
      type: String,
      default: "",
    },
    aparmentAddress: {
      type: String,
      default: "",
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Address = client.model("Address", addressSchema);

module.exports = Address;
