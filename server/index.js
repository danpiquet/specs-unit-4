const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { sequelize } = require("./util/database");

const { register, login, logout } = require("./controllers/auth.js");
const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts.js");
const { isAuthenticated } = require("./middleware/isAuthenticated.js");
const { Post } = require("./models/posts");
const { User } = require("./models/user");

const app = express();
const SERVER_PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cors());

User.hasMany(Post);
Post.belongsTo(User);

app.post("/register", register);
app.post("/login", login);
app.get("/posts", getAllPosts);
app.get("/userposts/:userid", getCurrentUserPosts);
app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  .then(() => {
    app.listen(SERVER_PORT, () => console.log(`db synced and docked at port ${SERVER_PORT}`));
  })
  .catch((err) => console.log(err));
