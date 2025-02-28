// export default class subjectModel {
//     constructor(subjectName, subjectCode, department, isElective = false) {
//       (this.subjectCode = subjectCode),
//         (this.subjectName = subjectName),
//         (this.department = department),
//         (this.isElective = isElective);
//     }
//   }

const mongoose = require('mongoose');
const subjectSchema = new mongoose.Schema({
    subjectCode: {
        type: String,
        required: true,
    },
    subjectName: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    isElective: {
        type: Boolean,
        required: true,
    },
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
