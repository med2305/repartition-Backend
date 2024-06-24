export { };
const express = require("express");
const controller = require("../controllers/avis.controller");
const router = express.Router();

router
    .route("/")
    .post(controller.createAvis);

router
    .route("/")
    .get(controller.getAvis);

router
    .route("/approve/:id")
    .patch(controller.approveAvis);

router
    .route("/disapprove/:id")
    .patch(controller.disapproveAvis);

module.exports = router;