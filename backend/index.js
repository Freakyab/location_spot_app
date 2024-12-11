const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const addressRouter = require("./address.controller.cjs");
const accountRouter = require("./account.controller.cjs");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/address", addressRouter);
app.use("/account", accountRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
