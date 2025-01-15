const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");

const clothingRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
