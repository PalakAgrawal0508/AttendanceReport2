import { getDB } from "../config/mongodb.js";
import UserRepository from "../reports/user.repository.js";

export default class FcaultyReportRepo {
	constructor() {
		this.userRepo = new UserRepository();
		this.TimeTableColletion = "TimeTable";
		this.attendanceCollection = "Attendance";
	}
	async facultySubjectList(empCode) {
		try {
			const emp = await this.userRepo.findByEmployeeCode(empCode);
			if (emp.status === "ok" && emp.data != null) {
				const db = await getDB();
				const collec = await db.collection(this.TimeTableColletion);
				const timeTableData = await collec.findOne({ ownerId: emp.data._id });

				const objectsSet = new Set();

				// Iterate over the TimeTable and its keys
				Object.keys(timeTableData.TimeTable).forEach((key) => {
					const elements = timeTableData.TimeTable[key]; // Access the array at each key

					elements.forEach((element) => {
						const { timing, ...rest } = element; // Destructure to exclude the 'timing' property

						// Convert the object (without timing) to a string and add to the Set to ensure uniqueness
						objectsSet.add(JSON.stringify(rest));
					});
				});

				// Convert the set back to an array and parse the objects
				const uniqueObjects = Array.from(objectsSet).map((item) =>
					JSON.parse(item)
				);

				return {
					status: "ok",
					message: "Success",
					data: uniqueObjects, // Return unique objects
				};
			} else {
				return {
					status: "err",
					message: emp.message,
					data: {},
				};
			}
		} catch (e) {
			console.log(e); // Log the error for debugging
			return {
				status: "err",
				message: e.message || "An error occurred", // Log the actual error message
				data: {},
			};
		}
	}
	/*
 data:{
//   ownerId: '65d7266cc7059e88b77a350f',
//   subjectId: '66963f0bb7cadc536c558204',
//   course: 'B-tech',
//   branch: 'CSE',
//   semester: 'III',
//   section: '01',
//   session: '2023-27'
// }

*/

	async facultyClassAttendancePercentage(data) {
		try {
			const { ownerId, subjectId, course, branch, semester, section, session } =
				data;
			// console.log(data);
			if (
				ownerId &&
				subjectId &&
				course &&
				branch &&
				semester &&
				section &&
				session
			) {
				const db = await getDB();
				const collec = await db.collection(this.attendanceCollection);
				const result = await collec.findOne({ ...data });
				const mp = new Map();
				let total = 0;
				result.attendance.forEach((attendanceRecord) => {
					total++;
					attendanceRecord.attendance.forEach((list) => {
						if (mp.has(list["Scholar No."])) {
							const tmp = mp.get(list["Scholar No."]);
							mp.set(list["Scholar No."], tmp + parseInt(list["isPresent"]));
						} else {
							mp.set(list["Scholar No."], parseInt(list["isPresent"]));
						}
					});
				});
				return {
					status: "ok",
					message: "Success",
					data: { totalClass: total, attendace: Object.fromEntries(mp) },
				};
			}
			return {
				status: "err",
				message: "Some data is missing",
				data: { totalClass: 0, attendace: {} },
			};

			// console.log(await collec.findOne({ ...data }));
		} catch (e) {
			console.log(e);
		}
	}
}
