export { };
import { NextFunction, Response, Request } from "express";
import { Demande } from "../models";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
import { ObjectId } from 'mongodb';


exports.create = async (
  req: Request,
  res: Response
) => {
  try {
    const { category, mark, range, model, imei, description, photo } = req.body;

    await new Demande({
      category,
      mark,
      range,
      model,
      imei,
      description,
      photo,
      status: "Nouveau"
    }).save();

    res.status(201).json({
      message: "Demande created",
    });
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};
exports.delete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid demande id" });
    }
    let deletedUser = await Demande.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "Demande not found" });
    }
    return res.status(200).json({ message: "Demande deleted successfully" });
  } catch (err) {
    res.status(404).json({
      message: "error",
    });
  }
};
exports.count = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await Demande.countDocuments();
    res.status(200).json(count);
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};
exports.list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, technicianId, deliveryId } = req.query as { status: string; technicianId: string; deliveryId: string };
    interface Filter {
      status?: string;
      technicianId?: string;
      deliveryId?: string;
    }

    let filter: Filter = {};

    if (status) {
      filter.status = status;
    }

    if (technicianId) {
      filter.technicianId = technicianId;
    }

    if (deliveryId) {
      filter.deliveryId = deliveryId;
    }

    const requests = await Demande.find(filter);

    res.status(200).json({
      message: "Requests retrieved successfully",
      data: requests
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: "Invalid requestId" });
    }

    const {
      category,
      mark,
      range,
      model,
      problem,
      imei,
      description,
      photos,
      status,
      clientId,
      technicianId,
      comments
    } = req.body;

    // Validate required fields
    if (
      !(
        category ||
        mark ||
        range ||
        model ||
        problem ||
        imei ||
        description ||
        photos ||
        status ||
        clientId ||
        comments ||
        technicianId
      )
    ) {
      return res
        .status(400)
        .json({ error: "At least one variable is required" });
    }

    const selectedFields: {
      category?: any;
      mark?: any;
      range?: any;
      model?: any;
      problem?: any;
      imei?: any;
      description?: any;
      photos?: any;
      status?: any;
      clientId?: any;
      comments?: any;
      technicianId?: any;
    } = {};

    if (category) selectedFields.category = category;
    if (mark) selectedFields.mark = mark;
    if (range) selectedFields.range = range;
    if (model) selectedFields.model = model;
    if (problem) selectedFields.problem = problem;
    if (imei) selectedFields.imei = imei;
    if (description) selectedFields.description = description;
    if (photos) selectedFields.photos = photos;
    if (status) selectedFields.status = status;
    if (clientId) selectedFields.clientId = clientId;
    if (comments) selectedFields.comments = comments;
    if (technicianId) {
      selectedFields.technicianId = technicianId;
      selectedFields.status = 'technicien affecté';
    }
    const updatedRequest = await Demande.findByIdAndUpdate(requestId, selectedFields, { new: true });

    if (!updatedRequest) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    res.status(200).json({
      message: "Request updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

