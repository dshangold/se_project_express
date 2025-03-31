const BadRequestError = require("../errors/badrequest");
const ForbiddenError = require("../errors/forbidden");
const NotFoundError = require("../errors/notfound");
const ClothingItem = require("../models/clothingItem");
// const {
//   BAD_REQUEST,
//   SERVER_ERROR,
//   NOT_FOUND,
//   FORBIDDEN,
// } = require("../utils/errors");

const createClothingItem = (req, res, next) => {
  console.log(req);

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
        // return res.status(BAD_REQUEST).send({ message: "Error creating item" });
        return next(new BadRequestError("Invalid Request"));
      }
      return next(err);
      // return res.status(SERVER_ERROR).send({ message: "Error from item" });
    });
};

const getAllClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      return next(err);
      // return res.status(SERVER_ERROR).send({ message: "Error from getItems" });
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(userId)) {
        return next(
          new ForbiddenError("Not allowed to delete another user's item")
        );
      }

      return ClothingItem.deleteOne({ _id: item._id }).then(() =>
        res.status(200).send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Error deleting item"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Invalid ID"));
      }
      return next(err);
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
    .then((updatedItems) => res.status(200).send(updatedItems))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Error liking item"));
        // return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
        // return res.status(NOT_FOUND).send({ message: "Invalid Id" });
      }
      return next(err);
      // return res.status(SERVER_ERROR).send({ message: "Error from likeItem" });
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
    .then((updatedItems) => res.status(200).send(updatedItems))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Error removing like"));
        // return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
        // return res.status(NOT_FOUND).send({ message: "Invalid Id" });
      }
      return next(err);
      // return res
      //   .status(SERVER_ERROR)
      //   .send({ message: "Error from deleteItem" });
    });
};

module.exports = {
  createClothingItem,
  getAllClothingItems,
  // updateClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
