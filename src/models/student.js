// export default class StudentModel {
//     constructor(scholarNumber, studentName, branch, section, batch) {
//       (this.scholarNumber = scholarNumber),
//         (this.StudentName = studentName),
//         (this.branch = branch),
//         (this.section = section),
//         (this.batch = batch);
//     }
//   }

const mongoose = require('mongoose');

const studentSchema = new mongoose.schema({
    scholarNumber: {
        type: String,
        required: true,
    },
    StudentName: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        required: true,
    },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;

