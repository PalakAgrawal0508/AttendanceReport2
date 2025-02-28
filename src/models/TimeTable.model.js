import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

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


export default model('TimeTable', MySchema);
