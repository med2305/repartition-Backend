export {};
const express = require("express");
const controller = require("../controllers/user.controller");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");

router
  .route("/")
  .post( controller.createUser);

router
  .route("/:id")
  .delete(controller.deleteUser);

router.route("/").get(controller.list);

router
  .route("/:id")
  .patch( controller.update);

router
  .route("/count")
  .get(verifyToken, authorize(["reviewer"]), controller.count);

module.exports = router;