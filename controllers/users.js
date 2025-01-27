const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  SERVER_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

// GET USERS //

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.send(users))
//     .catch((err) => {
//       console.error(err);
//       return res
//         .status(SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

// CREATE USERS //

const createUser = (req, res) => {
  const { password, name, avatar, email } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userData = { name, avatar, email, passowrd, _id: user._id };
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(11000).send({ message: "Email already exists" });
      }
      if ((err.name = "ValidationError")) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid Data provided" });
      }
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};
// LOGIN //

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message.includes("Incorrect email or password")) {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }

      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// GET USER BY ID //

const getCurrentUser = (req, res) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((user) =>
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Error creating user" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Error creating user" });
      }
      return res.status(SERVER_ERROR).send({ message: "Error creating user" });
    });
};

// UPDATE USER //

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(_id),
    { name, avatar },
    { new: true, runValidators: true }
      .orFail(() => {
        throw new Error("DocumentNotFoundError");
      })
      .then((user) => {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        });
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "DocumentNotFoundError") {
          return res.status(NOT_FOUND).send({ message: "User not found" });
        }
        if (err.name === "ValidationError") {
          return res
            .status(BAD_REQUEST)
            .send({ message: "Invalid info provided" });
        }
        return res
          .status(SERVER_ERROR)
          .send({ message: "An error occured on the server" });
      });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
