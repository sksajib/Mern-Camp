const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
dotenv.config();
const app = express();
const fs = require("fs");
const route = require("./routes/auth");
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB connection error =>", err));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3030"],
  })
);
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);
app.use(morgan("dev"));
const port = process.env.PORT;
app.listen(port, () => console.log(`Server running on ${port}`));
