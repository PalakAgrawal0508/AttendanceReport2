// class subjectModel {
//     constructor(
//       subject,
//       branch,
//       semester,
//       timing,
//       section,
//       location,
//       course,
//       session
//     ) {
//       (this.subject = subject),
//         (this.branch = branch),
//         (this.semester = semester),
//         (this.timing = timing),
//         (this.section = section),
//         (this.location = location),
//         (this.course = course),
//         (this.session = session);
//     }
//   }

//   class TimeTableModel {
//     constructor(ownerId) {
//       (this.ownerId = ownerId),
//         (this.TimeTable = timeTableList),
//         ////////for rescheduling to me////////
//         (this.assignedToMe = timeTableList),
//         (this.meAssignedToOther = timeTableList),
//         (this.request = []),
//         (this.meRequestedOther = []);
//     }
//   }

//   const timeTableList = {
//     1: [],
//     2: [],
//     3: [],
//     4: [],
//     5: [],
//     6: [],
//     7: [],
//   };

//   export { subjectModel, TimeTableModel };

const mongoose = require('mongoose');

const subjectModelSchema = new mongoose.Schema({
    subject: {
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
    timing: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    session: {
        type: String,
        required: true,
    },

});

const Subject = mongoose.model("Subject", subjectModelSchema);

const timetableSchema = new mongoose.Schema({
    ownerId: {
        type: String,
        required: true,
    },
    TimeTable: {
        type: Object,
        properties: {
            1: { type: Array },
            2: { type: Array },
            3: { type: Array },
            4: { type: Array },
            5: { type: Array },
            6: { type: Array },
            7: { type: Array },
        }
    },
    assignedToMe: {
        type: Object,
        properties: {
            1: { type: Array, required: true },
            2: { type: Array },
            3: { type: Array },
            4: { type: Array },
            5: { type: Array },
            6: { type: Array },
            7: { type: Array },
        }
    },
    meAssignedToOther: {
        type: Object,
        properties: {
            1: { type: Array },
            2: { type: Array },
            3: { type: Array },
            4: { type: Array },
            5: { type: Array },
            6: { type: Array },
            7: { type: Array },
        }
    },
    request: {
        type: Array,
    },
    meRequestedOther: {
        type: Array,
    },
});
const Timetable = mongoose.model("Timetable", timetableSchema);

export { Subject, TimeTable };


const SubjectSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    subjectCode: { type: String, required: true },
    subjectName: { type: String, required: true },
    department: { type: String, required: true },
    isElective: { type: Boolean, required: true }
}, { _id: false });

const TimeSlotSchema = new Schema({
    subject: { type: SubjectSchema, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    timing: { type: String, required: true },
    section: { type: String, required: true },
    location: { type: String, required: true },
    course: { type: String, required: true },
    session: { type: String, required: true }
}, { _id: false });


const daySchema = () => ({
    "1": { type: [TimeSlotSchema], default: [] },
    "2": { type: [TimeSlotSchema], default: [] },
    "3": { type: [TimeSlotSchema], default: [] },
    "4": { type: [TimeSlotSchema], default: [] },
    "5": { type: [TimeSlotSchema], default: [] },
    "6": { type: [TimeSlotSchema], default: [] },
    "7": { type: [TimeSlotSchema], default: [] }
});


const MySchema = new Schema({
    ownerId: { type: Schema.Types.ObjectId, required: true },
    TimeTable: {
        "1": { type: [TimeSlotSchema], default: [] },
        "2": { type: [TimeSlotSchema], default: [] },
        "3": { type: [TimeSlotSchema], default: [] },
        "4": { type: [TimeSlotSchema], default: [] },
        "5": { type: [TimeSlotSchema], default: [] },
        "6": { type: [TimeSlotSchema], default: [] },
        "7": { type: [TimeSlotSchema], default: [] }
    },
    assignedToMe: {
        "1": { type: [TimeSlotSchema], default: [] },
        "2": { type: [TimeSlotSchema], default: [] },
        "3": { type: [TimeSlotSchema], default: [] },
        "4": { type: [TimeSlotSchema], default: [] },
        "5": { type: [TimeSlotSchema], default: [] },
        "6": { type: [TimeSlotSchema], default: [] },
        "7": { type: [TimeSlotSchema], default: [] }
    },
    meAssignedToOther: {
        "1": { type: [TimeSlotSchema], default: [] },
        "2": { type: [TimeSlotSchema], default: [] },
        "3": { type: [TimeSlotSchema], default: [] },
        "4": { type: [TimeSlotSchema], default: [] },
        "5": { type: [TimeSlotSchema], default: [] },
        "6": { type: [TimeSlotSchema], default: [] },
        "7": { type: [TimeSlotSchema], default: [] }
    },
    request: { type: [Schema.Types.Mixed], default: [] },
    meRequestedOther: { type: [Schema.Types.Mixed], default: [] }
});


module.exports = mongoose.model('TimeTable', MySchema)


