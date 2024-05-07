export {};
import { NextFunction, Response, Request } from "express";
import { User } from "../models";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { tokenKey } = require("../config/vars");

exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { identifier, password } = req.body;
    const _user = await User.findOne({
      $and: [
        {
          $or: [
            { email: identifier },
            { name: identifier },
          ],
        },
        //  { activated: true },
        //  { role : 'user'}
      ],
    });
    
    if (!_user) return res.status(404).json({ message: " utilisateur non trouvé" });
    const isMatch = await bcrypt.compare(password, _user.password);
    if (!isMatch) return res.status(404).json({ message: " mot de passe incorrect" });
    

    const token = jwt.sign(
      {
        userId: _user._id,
        role: _user.role,
      },
      tokenKey,
      { expiresIn: "168h" }
    );
    res.status(200).json({
      message: "success",
      token: token,
    });
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};
