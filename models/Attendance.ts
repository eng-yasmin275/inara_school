import mongoose, { Schema, model, models } from "mongoose";

export interface IAttendance {
  personId: string; // student or employee
  category: "students" | "employees";
  className?: string;
  schoolYear: string; // e.g., "2025/2026"
  month: number;
  year: number;
  attendance: boolean[]; // true = present, false = absent
  holidays: number[];    // days marked as holiday
}

const AttendanceSchema = new Schema<IAttendance>({
  personId: { type: String, required: true },
  category: { type: String, required: true },
  className: { type: String, default: "" },
  schoolYear: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  attendance: { type: [Boolean], required: true },
  holidays: { type: [Number], default: [] },
}, { timestamps: true });

const Attendance = models.Attendance || model<IAttendance>("Attendance", AttendanceSchema);
export default Attendance;
