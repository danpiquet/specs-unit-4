const { Post } = require("../models/posts");
const { User } = require("../models/user");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { privateStatus: false },
      include: [
        {
          model: User,
          required: true,
          attributes: ["username"],
        },
      ],
    });
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
  console.log("getAllPosts function");
};
const getCurrentUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.findAll({
      where: { userId: +userId },
      include: [
        {
          model: User,
          required: true,
          attributes: ["username"],
        },
      ],
    });
    res.status(200).send(posts);
  } catch (err) {
    console.log("Error in getCurrentUserPosts", err);
    res.sendStatus(400);
  }
  // console.log("getCurrentUserPosts function");
};
const addPost = async (req, res) => {
  try {
    const { title, content, status, userId } = req.body;
    await Post.create({
      title: title,
      content: content,
      privateStatus: status,
      userId: userId,
    });
    res.sendStatus(200);
  } catch (err) {
    console.log("Error in addPost", err);
    res.sendStatus(400);
  }
};
const editPost = async (req, res) => {
  try {
    const { id, status } = req.params;
    await Post.update({ privateStatus: status }, { where: { id: +id } });
    res.sendStatus(200);
  } catch (err) {
    console.log("Error in editPost", err);
    res.sendStatus(400);
  }
};
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await Post.destroy({ where: { id: +id } });
    res.sendStatus(200);
  } catch (err) {
    console.log("Error in deletePost", err);
    res.sendStatus(400);
  }
  console.log("deletePost function");
};

module.exports = {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
};
