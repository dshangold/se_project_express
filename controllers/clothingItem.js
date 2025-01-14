const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND } = require("../utils/errors");

const createClothingItem = (req, res) => {
  console.log(req.user._id);
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error creating item", err });
      }
      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Error creating item", err });
      }
      return res.status(SERVER_ERROR).send({ message: "Error from item", err });
    });
};

const getAllClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR)
        .send({ message: "Error from getItems", err });
    });
};

const updateClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .send({ message: "Error from updateClothingItem", err });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(204).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Error deleting item", err });
      }
      return res
        .status(NOT_FOUND)
        .send({ message: "Error deleting item", err });
    });
};

const likeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((updatedItems) => {
      if (!updatedItems) {
        return res.status(BAD_REQUEST).send({ message: "Item Not Found" });
      }
      return res.status(200).send(updatedItems);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((updatedItems) => {
      if (!updatedItems) {
        return res.status(BAD_REQUEST).send({ message: "Item Not Found" });
      }
      return res.status(200).send(updatedItems);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return next(err);
    });
};

module.exports = {
  createClothingItem,
  getAllClothingItems,
  updateClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
