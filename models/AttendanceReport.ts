import mongoose, { Schema, model, models } from "mongoose";

export interface IAttendanceReport {
  personId: string;
  name: string;
  category: "students" | "employees";
  schoolYear: string;
  month: number;
  year: number;
  presentDays: number;
  absentDays: number;
  holidayDays: number;
  attendancePercentage: number;
}

const AttendanceReportSchema = new Schema<IAttendanceReport>({
  personId: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  schoolYear: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  presentDays: { type: Number, required: true },
  absentDays: { type: Number, required: true },
  holidayDays: { type: Number, required: true },
  attendancePercentage: { type: Number, required: true },
}, { timestamps: true });

const AttendanceReport = models.AttendanceReport || model<IAttendanceReport>("AttendanceReport", AttendanceReportSchema);
export default AttendanceReport;
