const ClothingItem = require("../models/clothingItem");

const createClothingItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      res.status(500).send({ message: "Error from createItem", err });
    });
};

const getAllClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      res.status(500).send({ message: "Error from getItems", err });
    });
};

const updateClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      res.status(500).send({ message: "Error from updateClothingItem", err });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) => {
      res.status(500).send({ message: "Error from deleteClothingItem", err });
    });
};

const likeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((updatedItems) => {
      if (!updatedItems) {
        return res.status(400).send({ message: "Item Not Found" });
      }
      return res.status(200).send(updatedItems);
    })
    .catch((err) => {
      return res.send(500).send({ message: "Invalid item ID" });
    });
};

const dislikeItem = (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((updatedItems) => {
      if (!updatedItems) {
        return res.status(400).send({ message: "Item Not Found" });
      }
      return res.status(200).send(updatedItems);
    })
    .catch((err) => {
      return res.send(500).send({ message: "Invalid item ID" });
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
