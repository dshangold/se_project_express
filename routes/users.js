const router = require("express").Router();

router.get("/", () => console.log("GET users"));
router.get("/:userId", () => console.log("GET users by ID"));
router.post("/", () => console.log("POST users"));

module.exports = router;
