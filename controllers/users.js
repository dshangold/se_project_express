const User = require("../models/user");

// GET USERS //

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
    });
};

module.exports = { getUsers };
