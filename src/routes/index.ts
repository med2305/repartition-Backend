export {};
import express from "express";
const authRouter = require("../routes/auth.route");
const userRouter = require("../routes/user.route");
const demandeRouter = require("../routes/demande.route");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/demande", demandeRouter);


module.exports = router;