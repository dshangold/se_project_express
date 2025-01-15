const router = require("express").Router();
const { SERVER_ERROR } = require("../utils/errors");

const clothingRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res) => {
  res.status(SERVER_ERROR).send({ message: "Router not found" });
});

module.exports = router;
