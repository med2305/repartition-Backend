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
    const { name, password, role, adress, phoneNumber, email } = req.body;


    const isPrimaryEmailTaken = await User.isEmailTaken(email);
    if (isPrimaryEmailTaken)
      return res.status(403).json({
        message: "Email 1 existe déjà",
      });

    const hashedPassword = await bcrypt.hash(password, 12);

    await new User({
      name,
      role,
      password: hashedPassword,
      phoneNumber,
      email,
      adress
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
    const users = await User.find()
      .select(" -password ")
      .sort({ createdAt: -1 })
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};
exports.listOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const {
      name,
      role,
      phoneNumber,
      email,
      password,
      adress,
    } = req.body;

    // Validate required fields
    if (
      !(
        name ||
        role ||
        phoneNumber ||
        email ||
        password ||
        adress
      )
    ) {
      return res
        .status(400)
        .json({ error: "At least one variable is required" });
    }

    const selectedFields: {
      name?: any;
      role?: any;
      phoneNumber?: any;
      email?: any;
      password?: any;
      adress?: any;
    } = {};

    if (name) selectedFields.name = name;
    if (role) selectedFields.role = role;
    if (phoneNumber) selectedFields.phoneNumber = phoneNumber;
    if (email) selectedFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      selectedFields.password = hashedPassword;
    }
    if (adress) selectedFields.adress = adress;

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

