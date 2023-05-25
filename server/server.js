const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const User = require("../server/Models/user");
dotenv.config();
const app = express();

const fs = require("fs");
const route = require("./routes/auth");
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  path: "/socket.io",
  cors: {
    origin: [process.env.CLIENT_URL],
    allowedHeaders: ["Content-type"],
  },
});
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB connection error =>", err));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require(`./routes/${r}`))
);
let users = [];
io.on("connection", (socket) => {
  //console.log("Connected=>", socket.id);
  socket.on("userId", (id) => {
    console.log(id);
    let s = {
      socket: socket,
      userId: id,
    };
    users.push(s);
  });
  // if (users.length > 0) {
  //   console.log(users);
  // }
  socket.on("newPost", async (newPost) => {
    console.log(newPost);
    const user = await User.findById(newPost.postedBy._id);
    const following = user.following;
    console.log(following);
    if (following.length > 0) {
      for (let i = 0; i < following.length; i++) {
        if (users.length > 0) {
          for (let j = 0; j < users.length; j++) {
            if (following[i] == users[j].userId) {
              console.log(users[j]);
              users[j].socket.emit("newPost", newPost);
            }
          }
        }
      }
    }
  });
});

app.use(morgan("dev"));
const port = process.env.PORT;
http.listen(port, () => console.log(`Server running on ${port}`));
