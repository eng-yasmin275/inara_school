import mongoose, { Schema, model, models } from "mongoose";

export interface IHoliday {
  schoolYear: string;   // "2025/2026"
  month: number;
  year: number;
  day: number;
}

const HolidaySchema = new Schema<IHoliday>({
  schoolYear: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  day: { type: Number, required: true },
}, { timestamps: true });

const Holiday = models.Holiday || model<IHoliday>("Holiday", HolidaySchema);
export default Holiday;
