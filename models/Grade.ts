import mongoose from "mongoose";

const GradeSchema = new mongoose.Schema({
  nationalId: { type: String, required: true }, // link to Student
  subject: { type: String, required: true },
  className: { type: String, required: true },
  midterm1: { type: Number, default: 0 },
  finalTerm: { type: Number, default: 0 },
  exercises: { type: Number, default: 0 },
  classActivities: { type: Number, default: 0 },
  homework: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
});

const Grade = mongoose.models.Grade || mongoose.model("Grade", GradeSchema);
export default Grade;
