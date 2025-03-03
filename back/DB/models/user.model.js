import mongoose from "mongoose";
import { systemRoles,GenderTypes } from "../../src/utils/index.js";
import { hashSync, compareSync } from "bcrypt";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(GenderTypes),
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
    },
    userType: {
      type: String,
      default: "user",
      enum: Object.values(systemRoles), // CUSTOMER,VENDOR
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isMarkedAsDeleted: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
    if(this.isModified("password")){
        this.password = hashSync(this.password, +process.env.SALT_ROUNDS);
    }
    next();
})
export const User = mongoose.models.User || model("User", userSchema);
