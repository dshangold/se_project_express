const router = require("express").Router();

const {
  createClothingItem,
  getAllClothingItems,
  updateClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItem");

//Create
router.post("/", createClothingItem);
//Read
router.get("/", getAllClothingItems);
//Update
router.put("/:itemId", updateClothingItem);
//Delete
router.delete("/:itemId", deleteClothingItem);

module.exports = router;
