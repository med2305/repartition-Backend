export {};
const express = require("express");
const controller = require("../controllers/demande.controller");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const authorize = require("../middleware/authorize");

router
  .route("/")
  .post( controller.create);

router
  .route("/:id")
  .delete(controller.delete);

router.route("/").get(controller.list);

router
  .route("/:id")
  .patch( controller.update );

router
  .route("/count")
  .get( controller.count );

module.exports = router;