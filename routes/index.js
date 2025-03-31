const router = require("express").Router();
// const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const clothingRouter = require("./clothingItem");
const userRouter = require("./users");
const {
  validateUserCreate,
  validateUserLogin,
} = require("../middlewares/validation");
const NotFoundError = require("../errors/notfound");

// Authorization

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserCreate, createUser);

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res, next) => next(new NotFoundError("Router not found")));

module.exports = router;
