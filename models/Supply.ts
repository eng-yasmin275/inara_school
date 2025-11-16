import mongoose, { Schema, models } from "mongoose";

const SupplySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Supply = models.Supply || mongoose.model("Supply", SupplySchema);

export default Supply;
