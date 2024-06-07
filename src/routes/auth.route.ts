export {};
const express = require("express");
const controller = require("../controllers/auth.controller");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.route("/login").post(controller.login);
router.route("/register").post(controller.register);

router.get('/verifyToken', verifyToken, (req:any, res:any) => {
    // If the middleware has passed, it means the token is valid
    res.json({ isValidToken: true });
  });

module.exports = router;