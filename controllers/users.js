const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require("../utils/errors");

// GET USERS //

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      const error = new Error("No Users Found");
      error.name = "NotFoundError";
      throw error;
    })
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "Error retrieving users", error: err.message });
    });
};

// CREATE USERS //

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name) {
    return res.status(BAD_REQUEST).send({ message: "Name is required" });
  }

  console.log("Creating user with:", { name, avatar });

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

// GET USER BY ID //

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.name = "NotFoundError";
      throw error;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Error creating user", error: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error creating user", error: err.message });
      }
      return res
        .status(NOT_FOUND)
        .send({ message: "Error creating user", error: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
