import { Schema, model } from 'mongoose';

const attendanceSchema = new Schema({
    Scholar_No: { type: String, required: true },
    Name_of_Student: { type: String, required: true },
    isPresent: { type: String, required: true } // Assuming it's stored as a string ("1"/"0")
});

const attendanceRecordSchema = new Schema({
    date: { type: String, required: true },
    attendance: [attendanceSchema] // Array of attendance records
});

const attendanceDocumentSchema = new Schema({
    ownerId: { type: String, required: true },
    subjectId: { type: String, required: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    section: { type: String, required: true },
    session: { type: String, required: true },
    attendance: [attendanceRecordSchema] // Array of attendance records per date
}, { timestamps: true });

const AttendanceDocument = model('AttendanceDocument', attendanceDocumentSchema);

export default AttendanceDocument;