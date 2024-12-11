import express from "express";
import { json } from "body-parser";
import cors from "cors";
import addressRouter from "./address.controller.cjs";
import accountRouter from "./account.controller.cjs";

const PORT = process.env.PORT || 8000;
const app = express();
app.use(json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/address", addressRouter);
app.use("/account", accountRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
