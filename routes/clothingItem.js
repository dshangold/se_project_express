const router = require("express").Router();

const {
  createClothingItem,
  getAllClothingItems,
  // updateClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// Create //
router.post("/", createClothingItem);
// Read //
router.get("/", getAllClothingItems);
// Update //
// router.put("/:itemId", updateClothingItem);
// Delete //
router.delete("/:itemId", deleteClothingItem);
// Like //
router.put("/:itemId/likes", likeItem);
// Dislike //
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
