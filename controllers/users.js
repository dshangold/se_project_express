const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   SERVER_ERROR,
//   UNAUTHORIZED,
//   CONFLICT,
// } = require("../utils/errors");
const ConflictError = require("../errors/conflict");
const BadRequestError = require("../errors/badrequest");
const UnauthorizedError = require("../errors/unauthorized");
const NotFoundError = require("../errors/notfound");

// CREATE USERS //

const createUser = (req, res, next) => {
  const { password, name, avatar, email } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userData = { name, avatar, email, _id: user._id };
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already exists"));
        // return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid Data provided" });
      }
      return next(err);
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error occurred on the server" });
    });
};
// LOGIN //

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
    // return res
    //   .status(BAD_REQUEST)
    //   .send({ message: "Email and password are required" });
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
        return next(new UnauthorizedError("Incorrect email or password"));
        // return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      console.error(err);
      return next(err);
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

// GET USER BY ID //

const getCurrentUser = (req, res, next) => {
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
        return next(new NotFoundError("User not found"));
        // return res.status(NOT_FOUND).send({ message: "Error creating user" });
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid request"));
        // return res.status(BAD_REQUEST).send({ message: "Error creating user" });
      }
      return next(err);
      // return res.status(SERVER_ERROR).send({ message: "Error creating user" });
    });
};

// UPDATE USER //

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(new Error("Not Found"))
    .then((user) => res.send({ name: user.name, avatar: user.avatar }))
    .catch((err) => {
      if (err.name === "Not Found") {
        return next(new NotFoundError("User not found"));
        // return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data provided"));
        // return res
        //   .status(BAD_REQUEST)
        //   .send({ message: "Invalid Data provided" });
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("error updating user"));
        // return res.status(BAD_REQUEST).send({ message: "Error updating user" });
      }
      return next(err);
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
