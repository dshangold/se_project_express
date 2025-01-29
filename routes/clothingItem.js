const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createClothingItem,
  getAllClothingItems,
  // updateClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// Create //
router.post("/", auth, createClothingItem);
// Read //
router.get("/", getAllClothingItems);
// Update //
// router.put("/:itemId", updateClothingItem);
// Delete //
router.delete("/:itemId", auth, deleteClothingItem);
// Like //
router.put("/:itemId/likes", auth, likeItem);
// Dislike //
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
