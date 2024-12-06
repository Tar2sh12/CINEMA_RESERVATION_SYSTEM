import mongoose from "mongoose";
import { systemRoles, GenderTypes } from "../../src/utils/index.js";
import { hashSync, compareSync } from "bcrypt";
const { Schema, model } = mongoose;

const movieSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    time_reservation: [
      {
        time_available: Date,
        usersId: [
          {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //CUSTOMER
            seats_reserved: [Number],
          },
        ],
      },
    ],
    slug: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // VENDOR
      required: true, //? (done) Change to true after adding authentication
    },
    Images: {
      secure_url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
        unique: true,
      },
    },
    customId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Movie = mongoose.models.Movie || model("Movie", movieSchema);
