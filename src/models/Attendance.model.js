import mongoose from "mongoose"
const { Schema } = mongoose;

// Schema for each student's attendance record
const InnerAttendanceSchema = new Schema({
  "isPresent": { type: String, required: true },
  "Name Of Student": { type: String, required: true },
  "Scholar No.": { type: String, required: true }
}, { _id: false });

// Schema for each attendance entry (date + array of students)
const AttendanceEntrySchema = new Schema({
  attendance: { type: [InnerAttendanceSchema], default: [] },
  date: { type: String, required: true },
  remark: { type: String, default: '' }
}, { _id: false });

// Main schema
const GeneralSchema = new Schema({
  attendance: { type: [AttendanceEntrySchema], default: [] },
  branch: { type: String, required: true },
  course: { type: String, required: true },
  isMarked: { type: [String], default: [] },
  ownerId: { type: String, required: true },
  section: { type: String, required: true },
  semester: { type: String, required: true },
  session: { type: String, required: true },
  // subjectId can be a string or an ObjectId, so we use Mixed for flexibility
  subjectId: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });
const AttedanceModal = mongoose.model('Attendance', GeneralSchema);
export default AttedanceModal
