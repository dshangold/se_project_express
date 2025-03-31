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
const { validateCardBody, validateId } = require("../middlewares/validation");

// Create //
router.post("/", auth, validateCardBody, createClothingItem);
// Read //
router.get("/", getAllClothingItems);
// Update //
// router.put("/:itemId", updateClothingItem);
// Delete //
router.delete("/:itemId", auth, validateId, deleteClothingItem);
// Like //
router.put("/:itemId/likes", auth, validateId, likeItem);
// Dislike //
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
