export { };
const { Role } = require("../utils/enums");
import { Document, Schema, model } from "mongoose";

interface IAvis extends Document {
  userName: string;
  msg: string;
  userPhoto: string;
  approved: boolean;
}

const avisSchema = new Schema<IAvis>(
  {
    userName: {
      type: String,
    },
    msg: {
      type: String,
    },
    userPhoto: {
      type: String,
    },
    approved: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model<IAvis>("Avis", avisSchema);

