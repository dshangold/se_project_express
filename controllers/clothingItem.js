const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, SERVER_ERROR, NOT_FOUND } = require("../utils/errors");

const createClothingItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
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
    .then((items) => res.status(200).send({ data: items }))
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
      return res
        .status(SERVER_ERROR)
        .send({ message: "Error from updateClothingItem", err });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({}))
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

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
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
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Invalid Id" });
      }

      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((updatedItems) => {
      if (!updatedItems) {
        return res.status(NOT_FOUND).send({ message: "Item Not Found" });
      }
      return res.status(200).send(updatedItems);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Invalid Id" });
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
