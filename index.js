const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PRT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello FROM DAILY TASK!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
