const path = require("path");

const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ncubelab-image-assessment-demo" });
});

app.listen(port, () => {
  console.log(`NCubeLab demo is listening on port ${port}`);
});
