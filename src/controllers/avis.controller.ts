export { };
import { NextFunction, Response, Request } from "express";
import { Avis } from "../models";
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.createAvis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Step 1: Extract data from request
        const { userName, msg, userPhoto } = req.body;

        // Step 2: Optionally validate the data here

        // Step 3 & 4: Create and save the Avis document
        const newAvis = new Avis({
            userName,
            msg,
            userPhoto,
            approved: false, // Assuming your Avis model has a 'user' field for the user who created the avis
        });

        const savedAvis = await newAvis.save();

        // Step 5: Send response
        res.status(201).json({
            message: "Avis created successfully",
            avis: savedAvis,
        });
    } catch (error) {
        // Handle potential errors
        next(error);
    }
};

exports.getAvis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Step 1: Fetch all Avis documents
        const avis = await Avis.find();

        // Step 2: Send response
        res.status(200).json({
            message: "Avis fetched successfully",
            avis,
        });
    } catch (error) {
        // Handle potential errors
        next(error);
    }
};

exports.approveAvis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Step 1: Extract the Avis ID
        const avisId = req.params.id;

        // Step 2 & 3: Find the Avis document and update its status
        const updatedAvis = await Avis.findByIdAndUpdate(
            avisId,
            { approved: true }, // Assuming the status field exists and 'approved' is a valid value
            { new: true } // Option to return the document after update
        );

        if (!updatedAvis) {
            return res.status(404).json({ message: 'Avis not found' });
        }

        // Step 4: The document is already saved by findByIdAndUpdate

        // Step 5: Send a response
        res.status(200).json({
            message: 'Avis approved successfully',
            avis: updatedAvis,
        });
    } catch (error) {
        // Handle potential errors
        next(error);
    }
};

exports.disapproveAvis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Step 1: Extract the Avis ID
        const avisId = req.params.id;

        // Step 2 & 3: Find the Avis document and update its status
        const updatedAvis = await Avis.findByIdAndUpdate(
            avisId,
            { approved: false }, // Assuming the status field exists and 'approved' is a valid value
            { new: true } // Option to return the document after update
        );

        if (!updatedAvis) {
            return res.status(404).json({ message: 'Avis not found' });
        }

        // Step 4: The document is already saved by findByIdAndUpdate

        // Step 5: Send a response
        res.status(200).json({
            message: 'Avis disapproved successfully',
            avis: updatedAvis,
        });
    } catch (error) {
        // Handle potential errors
        next(error);
    }
}