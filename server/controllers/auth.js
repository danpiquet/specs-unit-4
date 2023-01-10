require("dotenv").config();
const { SECRET } = process.env.SECRET;
const { User } = require("../models/user.js");
const { bcrypt } = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ where: { username: username } });
    if (foundUser) {
      res.status(400).send("Username already exists");
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const newUser = await User.create({
        username: username,
        hashedPass: hash,
      });

      const token = createToken(
        newUser.dataValues.username,
        newUser.dataValues.id
      );
      console.log(newUser);
      const exp = Date.now() + 1000 * 60 * 60 * 48;
      res.status(200).send({
        username: newUser.dataValues.username,
        userId: newUser.dataValues.id,
        token: token,
        exp: exp,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ where: { username } });
    if (foundUser) {
      const isAuthenticated = bcrypt.compareSync(
        password,
        foundUser.hashedPass
      );
      if (isAuthenticated) {
        const token = createToken(
          foundUser.dataValues.username,
          foundUser.dataValues.id
        );
        const exp = Date.now() + 1000 * 60 * 60 * 48;
        res.status(200).send({
          username: foundUser.dataValues.username,
          userId: foundUser.dataValues.id,
          token,
          exp,
        });
      } else {
        res.status(400).send("Unable to log in");
      }
    } else {
      res.status(400).send("Unable to log in");
    }
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

const logout = (req, res) => {
  console.log("logout function");
};

const createToken = (username, id) =>
  jwt.sign(
    {
      username,
      id,
    },
    SECRET,
    {
      expiresIn: "2d",
    }
  );

module.exports = {
  register,
  login,
  logout,
};
