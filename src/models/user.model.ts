export { };
const { Role } = require("../utils/enums");
import { Document, Schema, model } from "mongoose";

interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: typeof Role;
  phoneNumber: string;
  name: string;
  adress: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      lowercase: true,
      validate: {
        validator: function (value: string) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    name: {
      type: String,
    },
    adress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.statics.isEmailTaken = async function (email: string) {
  const users = await this.find({
    email: email,
  });
  return users.length > 0;
};

module.exports = model<IUser>("User", userSchema);

