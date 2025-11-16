import mongoose, { Schema, models } from "mongoose";

const SupplyLogSchema = new Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supply",
      required: true,
    },
    action: {
      type: String,
      enum: ["ADD", "INCREASE", "DECREASE", "DELETE"],
      required: true,
    },
    amount: { type: Number, default: 1 },
    description: String,
  },
  { timestamps: true }
);

const SupplyLog = models.SupplyLog || mongoose.model("SupplyLog", SupplyLogSchema);

export default SupplyLog;
