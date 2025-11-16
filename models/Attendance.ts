import mongoose, { Schema, model, models } from "mongoose";

interface IAttendance {
  personId: string; // student or employee
  category: "students" | "employees";
  className?: string;
  month: number;
  year: number;
  attendance: boolean[];
  holidays: number[];
}

const AttendanceSchema = new Schema<IAttendance>({
  personId: { type: String, required: true },
  category: { type: String, required: true },
  className: { type: String },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  attendance: { type: [Boolean], required: true },
  holidays: { type: [Number], default: [] },
});

export default models.Attendance || model("Attendance", AttendanceSchema);
