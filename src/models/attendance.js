const mongoose = require('mongoose');

const attendanceStudentItemSchema = new mongooseSchema({
    "Scholar No.": {
        type: String,
        required: true,
    },
    "Name of Student": {
        type: String,
        required: true,
    },
    isPresent: {
        type: Boolean,
        required: true,
    },
})
const AttendanceStudentItem = mongoose.model("AttendanceStudentItem", attendanceStudentItemSchema);

const attendanceItemSchema = new mongoose.Schema({
    date: {
        type: date,
        required: true,
    },
    attendance: {
        type: [attendanceStudentItemSchema],
        required: true,
    },
})
const AttendanceItem = mongoose.model("AttendanceItem", attendanceItemSchema);

const attendenceSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    subjectId: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    session: {
        type: String,
        required: true,
    },
    attendance: {
        type: [attendanceItemSchema],
        required: true,
    },
});
const Attendance = mongoose.model("Attendance", attendanceSchema);

export { AttendanceStudentItem, AttendanceItem, Attendance };
