import mongoose from 'mongoose';


const StudentSchema = new mongoose.Schema({
  nationalId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  className: { type: String, required: true },
  birthdate: { type: String, required: true },
  email: { type: String, default:"" },
  phone: { type: String, required: true },
  notes: { type: String, default: "" },
  absence: { type: Number, default: 0 },
  results: { type: Array, default: [] },
});


const Student = mongoose.models.Student || mongoose.model("Student", StudentSchema);
export default Student;