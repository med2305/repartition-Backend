export { };
import { NextFunction, Response, Request } from "express";
import { Demande } from "../models";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
import { ObjectId } from 'mongodb';
import { Status } from "../utils/enums";
import { Socket } from 'socket.io';
const socketIo = require("socket.io");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", (socket: Socket) => {
  console.log("New connection established");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  socket.on("project_done", (data: any) => {
    console.log("Run 2nd");
    io.emit("project_done", { message: data.message, id: data.id });
  });
  socket.on("new_project_assigned", (data: any) => {
    console.log("Run 3rd");
    io.emit("project_created", { message: data.message });
  });
});

exports.create = async (
  req: Request,
  res: Response
) => {
  try {
    const { category, mark, range, model, imei, description, photo, clientId } = req.body;

    await new Demande({
      category,
      mark,
      range,
      model,
      imei,
      description,
      photo,
      clientId,
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
    let requests;
    const { status, technicianId, deliveryId, clientId } = req.query as { status: string; technicianId: string; deliveryId: string; clientId: string };
    interface Filter {
      status?: string[];
      technicianId?: string;
      clientId?: string;
      $or?: [{ arrivalDeliveryId: string }, { departDeliveryId: string }];
    }

    let filter: Filter = {};

    if (status) {
      filter.status = status.split(',');
    }

    if (technicianId) {
      filter.technicianId = technicianId;
    }

    if (deliveryId) {
      filter.$or = [{ arrivalDeliveryId: deliveryId }, { departDeliveryId: deliveryId }];
    }

    if (clientId) {
      filter.clientId = clientId;
    }

    if (status && (status.includes('En attente de réception') || status.includes('technicien affecté'))) {
      requests = await Demande.find(filter).populate('clientId').populate('technicianId');
    } else {
      requests = await Demande.find(filter);
    }
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
      arrivalDeliveryId,
      departDeliveryId,
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
        technicianId ||
        arrivalDeliveryId ||
        departDeliveryId
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
      arrivalDeliveryId?: any;
      departDeliveryId?: any;
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
      selectedFields.status = Status.TechnicianAssigned;
    }
    if (arrivalDeliveryId) {
      selectedFields.arrivalDeliveryId = arrivalDeliveryId;
      selectedFields.status = Status.AwaitReciever;
    }
    if (departDeliveryId) {
      selectedFields.departDeliveryId = departDeliveryId;
      selectedFields.status = Status.UnderDelivery;
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
exports.getDemandeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: "Invalid requestId" });
    }
    // Modify the query to populate only the name of the user in comments.userId
    const request = await Demande.findById(requestId)
      .populate({
        path: 'comments.userId',
        select: 'name' // Only fetch the name field from the user document
      });
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }
    res.status(200).json({
      message: "Request retrieved successfully",
      data: request,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

exports.addCommentToDemande = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, msg } = req.body;

  if (!userId || !msg) {
    return res.status(400).send({ message: 'Missing userId or msg in request body.' });
  }

  try {
    const updatedDemande = await Demande.findByIdAndUpdate(
      id,
      { $push: { comments: { userId, msg } } },
      { new: true }
    );

    if (!updatedDemande) {
      return res.status(404).send({ message: 'Demande not found.' });
    }

    res.status(200).send(updatedDemande);
  } catch (error) {
    res.status(500).send({ message: 'Error updating demande with comment.', error });
  }
};

server.listen(3045, () => {
  console.log("Server is running on port 3045");
});