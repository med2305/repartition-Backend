export { };
import { NextFunction, Response, Request } from "express";
import { User } from "../models";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { no, name, password, role, category, phoneNumber, email } = req.body;

    const noTaken = await User.isNoTaken(no);
    if (noTaken) {
      return res.status(400).json({ message: "Ce No existe déja" });
    }

    const isPrimaryEmailTaken = await User.isEmailTaken(email);
    if (isPrimaryEmailTaken)
      return res.status(403).json({
        message: "Email 1 existe déjà",
      });

    const hashedPassword = await bcrypt.hash(password, 12);

    await new User({
      no,
      name,
      role,
      password: hashedPassword,
      phoneNumber,
      email,
      category,
    }).save();
    res.status(201).json({
      message: "user created",
    });
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};
exports.deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }
    let deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(404).json({
      message: "error",
    });
  }
};
exports.count = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json(count);
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({ role: 'technician' })
      .select(" -password ")
      .sort({ createdAt: -1 })
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const {
      no,
      name,
      role,
      phoneNumber,
      email,
      password,
      category,
    } = req.body;

    // Validate required fields
    if (
      !(
        no ||
        name ||
        role ||
        phoneNumber ||
        email ||
        password ||
        category
      )
    ) {
      return res
        .status(400)
        .json({ error: "At least one variable is required" });
    }
    if (no) {
      const noTaken = await User.isNoTaken(no, userId);
      if (noTaken) {
        return res.status(400).json({ message: "Ce No existe déja" });
      }
    }

    const selectedFields: {
      no?: any;
      name?: any;
      role?: any;
      phoneNumber?: any;
      email?: any;
      password?: any;
      category?: any;
    } = {};

    if (no) selectedFields.no = no;
    if (name) selectedFields.name = name;
    if (role) selectedFields.role = role;
    if (phoneNumber) selectedFields.phoneNumber = phoneNumber;
    if (email) selectedFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      selectedFields.password = hashedPassword;
    }
    if (category) selectedFields.category = category;

    const updatedUser = await User.findByIdAndUpdate(userId, selectedFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

