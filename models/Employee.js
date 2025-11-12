import mongoose, { Schema } from "mongoose";

const employeeSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  role: { type: String, default: "معلم" },
  subjects: { type: [String], default: [] },
  classes: { type: [String], default: [] },
  username: { type: String, required: false },
  password: { type: String, required: false },
});

const Employee = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

export default Employee;
